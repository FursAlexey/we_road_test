<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import {
  type CreateTourInput,
  type QueryTravelArgs,
  type SortArgs,
  type Tour,
  type Travel,
  type TravelToursArgs,
  type UpdateTourInput,
} from '~/types/__generated__/resolvers-types';
import {
  travelWithToursQuery,
  removeTourMutation,
  createTourMutation,
  updateTourMutation,
} from '~/queries';
import { useActiveUser } from '~/composables';
import ToursList from '~/components/toursList.vue';
import TourForm from '~/components/tourForm.vue';
import { formatDate } from '~/utils';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const travelId = route.params.travelId;
const { isAdmin, isEditor } = useActiveUser();

const params = reactive<TravelToursArgs>({
  offset: 0,
});
const travel = ref<Travel>();
const tours = ref<Tour[]>([]);
const hasMoreTours = ref(false);
const isTourFormOpened = ref(false);
const tourToUpdate = ref<Tour>();

// todo: configure and use cache properly
const { load: fetchTravel, refetch: refetchTravel } = useLazyQuery<
  {
    travel: Travel;
  },
  QueryTravelArgs & TravelToursArgs
>(
  travelWithToursQuery,
  {
    id: travelId as string,
    ...params,
  },
  {
    fetchPolicy: 'network-only',
  },
);
const { mutate: removeTour } = useMutation(removeTourMutation);
const { mutate: createTour } = useMutation<
  {
    createTour: Tour;
  },
  {
    createTourInput: CreateTourInput;
  }
>(createTourMutation);
const { mutate: updateTour } = useMutation<
  {
    updateTour: Tour;
  },
  {
    updateTourInput: UpdateTourInput;
  }
>(updateTourMutation);

const refetchTours = async () => {
  const variables: TravelToursArgs = {
    offset: params.offset,
    sort: params.sort,
    priceFrom: undefined,
    priceTo: undefined,
    startingDate: undefined,
    endingDate: undefined,
  };

  if (typeof params.priceFrom === 'number') {
    variables.priceFrom = params.priceFrom;
  }

  if (typeof params.priceTo === 'number') {
    variables.priceTo = params.priceTo;
  }

  if (params.startingDate) {
    variables.startingDate = params.startingDate;
  }

  if (params.endingDate) {
    variables.endingDate = params.endingDate;
  }

  const response = await refetchTravel({
    id: travelId as string,
    ...variables,
  });

  if (response) {
    hasMoreTours.value = response.data.travel.tours.hasMore;

    return response.data.travel.tours.data;
  }

  return [];
};

watch(params, async (value) => {
  const newTours = await refetchTours();

  if (value.offset === 0) {
    tours.value = newTours;
  } else {
    tours.value = [...tours.value, ...newTours];
  }
});

const closeTourForm = () => {
  isTourFormOpened.value = false;
  tourToUpdate.value = undefined;
};

const handleCreateTourFormSubmit = async (
  payload: Omit<CreateTourInput, 'travelId'>,
) => {
  const response = await createTour({
    createTourInput: {
      travelId: travelId as string,
      ...payload,
    },
  });

  if (response?.data) {
    tours.value = [...tours.value, response.data.createTour];
  }

  closeTourForm();
};

const handleUpdateTourFormSubmit = async (
  payload: Omit<UpdateTourInput, 'tourId'>,
) => {
  if (tourToUpdate.value) {
    console.log('payload: ', payload);
    const response = await updateTour({
      updateTourInput: {
        tourId: tourToUpdate.value.id,
        ...payload,
      },
    });

    if (response?.data) {
      const updatedTour = response.data.updateTour;

      tours.value = tours.value.map((tour) =>
        tour.id === updatedTour.id ? updatedTour : tour,
      );
    }
  }

  closeTourForm();
};

const handleTourFormSubmit = (payload: Omit<CreateTourInput, 'travelId'>) => {
  if (tourToUpdate.value) {
    handleUpdateTourFormSubmit(payload);
  } else {
    handleCreateTourFormSubmit(payload);
  }
};

const handleRemoveTourClick = async (id: string) => {
  await removeTour({
    id,
  });

  tours.value = tours.value.filter((tour) => tour.id !== id);
};

const handleEditTourClick = (id: string) => {
  const tourToEdit = tours.value.find((tour) => tour.id === id);

  if (tourToEdit) {
    tourToUpdate.value = tourToEdit;
    isTourFormOpened.value = true;
  }
};

const handleShowMoreClick = () => {
  if (typeof params.offset === 'number') {
    params.offset++;
  }
};

const handleSortChange = async (sort: SortArgs) => {
  params.offset = 0;
  params.sort = [sort];
};

onMounted(async () => {
  const response = await fetchTravel();

  if (response) {
    travel.value = response.travel;
    tours.value = response.travel.tours.data;
    hasMoreTours.value = response.travel.tours.hasMore;
  }
});
</script>

<template>
  <div class="container">
    <NuxtLayout name="common">
      <div class="flex flex-col gap-4">
        <div class="travelDetails">
          <h2>{{ travel?.name }}</h2>
          <p>{{ travel?.description }}</p>
        </div>
        <div class="flex flex-col">
          <div class="flex justify-between mb-8">
            <h4>Tours</h4>
            <UButton @click="isTourFormOpened = true">Create</UButton>
          </div>
          <div class="flex justify-between">

            <div class="flex gap-2 align-center">
              <UFormGroup label="Price from" name="priceFrom">
                <UInput v-model="params.priceFrom" type="number" step="0.01" />
              </UFormGroup>
              <UFormGroup label="Price to" name="priceTo">
                <UInput v-model="params.priceTo" type="number" step="0.01" />
              </UFormGroup>
            </div>

            <div class="flex gap-2 align-center">
              <UFormGroup label="Starting date" name="startingDate">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="
                      params.startingDate
                        ? formatDate(params.startingDate)
                        : 'Select date'
                    "
                  />

                  <template #panel="{ close }">
                    <LazyDatePicker
                      v-model="params.startingDate"
                      @close="close"
                    />
                  </template>
                </UPopover>
              </UFormGroup>
              <UFormGroup label="Ending date" name="endingDate">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="
                      params.endingDate
                        ? formatDate(params.endingDate)
                        : 'Select date'
                    "
                  />

                  <template #panel="{ close }">
                    <LazyDatePicker
                      v-model="params.endingDate"
                      @close="close"
                    />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
          </div>
          <ToursList
            :has-more="hasMoreTours"
            :tours="tours"
            :can-be-edited="isEditor"
            :can-be-deleted="isAdmin"
            @on-delete-click="handleRemoveTourClick"
            @on-more-click="handleShowMoreClick"
            @on-edit-click="handleEditTourClick"
            @on-sort-change="handleSortChange"
          />

          <UModal v-model="isTourFormOpened" prevent-close>
            <div class="p-4">
              <TourForm
                :tour-to-edit="tourToUpdate"
                @on-submit="handleTourFormSubmit"
                @on-cancel="closeTourForm"
              />
            </div>
          </UModal>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}

.travelDetails {
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 3rem;
  }
}

h4 {
  font-size: 2rem;
}
</style>
