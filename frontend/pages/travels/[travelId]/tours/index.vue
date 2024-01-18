<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type {
  CreateTourInput,
  QueryTravelArgs,
  Tour,
  Travel,
  TravelToursArgs,
  UpdateTourInput,
} from '~/types/__generated__/resolvers-types';
import {
  travelWithToursQuery,
  removeTourMutation,
  createTourMutation,
  updateTourMutation,
} from '~/queries';
import { useActiveUser } from '~/composables';
import ToursList from '~/components/toursList.vue';
import { DEFAULT_LIMIT } from '~/constants';
import TourForm from '~/components/tourForm.vue';
import TravelForm from '~/components/travelForm.vue';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const travelId = route.params.travelId;
const { isAdmin, isEditor } = useActiveUser();

const params = reactive<TravelToursArgs>({
  offset: 0,
  limit: DEFAULT_LIMIT,
});
const travel = ref<Travel>();
const tours = ref<Tour[]>([]);
const hasMoreTours = computed(
  () =>
    tours.value.length >=
    (params.limit ?? DEFAULT_LIMIT) * ((params.offset ?? 0) + 1),
);
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

const handleMoreClick = async () => {
  if (typeof params.offset === 'number') {
    params.offset++;
  }

  const variables: TravelToursArgs = {
    offset: params.offset,
  };

  if (params.priceFrom !== undefined) {
    variables.priceFrom = params.priceFrom;
  }

  if (params.priceTo !== undefined) {
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
    const nextTours = response.data.travel.tours;

    tours.value = [...tours.value, ...nextTours];
  }
};

const closeTourForm = () => {
  isTourFormOpened.value = false;
  tourToUpdate.value = undefined;
};

const handleCreateTourFormSubmit = async (
  payload: Omit<CreateTourInput, 'travelId'>,
) => {
  console.log('payload: ', payload);
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

onMounted(async () => {
  const response = await fetchTravel();

  if (response) {
    travel.value = response.travel;
    tours.value = response.travel.tours;
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
          <div class="flex justify-between">
            <h4>Tours</h4>
            <UButton @click="isTourFormOpened = true">Create</UButton>
          </div>
          <ToursList
            :has-more="hasMoreTours"
            :tours="tours"
            :can-be-edited="isEditor"
            :can-be-deleted="isAdmin"
            @on-delete-click="handleRemoveTourClick"
            @on-more-click="handleMoreClick"
            @on-edit-click="handleEditTourClick"
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
