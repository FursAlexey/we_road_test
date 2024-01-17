<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type {
  QueryTravelArgs,
  Tour,
  Travel,
  TravelToursArgs,
} from '~/types/__generated__/resolvers-types';
import { travelWithToursQuery, removeTourMutation } from '~/queries';
import { useActiveUser } from '~/composables';
import ToursList from '~/components/toursList.vue';

const route = useRoute();
const travelId = route.params.travelId;
const { isAdmin, isEditor } = useActiveUser();

const params = reactive<TravelToursArgs>({
  offset: 0,
});
const travel = ref<Travel>();
const tours = ref<Tour[]>([]);
const hasMoreTours = ref(true);

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
  },
  {
    fetchPolicy: 'network-only',
  },
);
const { mutate: removeTour } = useMutation(removeTourMutation);

async function handleMoreClick() {
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

    if (nextTours.length > 0) {
      tours.value = [...tours.value, ...nextTours];
    } else {
      hasMoreTours.value = false;
    }
  }
}

async function handleRemoveTourClick(id: string) {
  await removeTour({
    id,
  });

  tours.value = tours.value.filter((tour) => tour.id !== id);
}

onMounted(async () => {
  const response = await fetchTravel();

  if (response) {
    travel.value = response.travel;
    tours.value = response.travel.tours;

    if (tours.value.length === 0) {
      hasMoreTours.value = false;
    }
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
            <UButton v-if="isAdmin" size="sm">Create</UButton>
          </div>
          <ToursList
            :has-more="hasMoreTours"
            :tours="tours"
            :can-be-edited="isEditor"
            :can-be-deleted="isAdmin"
            @on-delete-click="handleRemoveTourClick"
            @on-more-click="handleMoreClick"
          />
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
