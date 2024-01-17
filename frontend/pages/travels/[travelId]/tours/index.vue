<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type {
  QueryTravelArgs,
  Tour,
  Travel,
  TravelToursArgs,
} from '~/types/__generated__/resolvers-types';
import { travelWithToursQuery, removeTourMutation } from '~/queries';
import { useActiveUser } from '~/composables';
import ToursList from '~/components/toursList.vue';
import { DEFAULT_LIMIT } from '~/constants';

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

    tours.value = [...tours.value, ...nextTours];
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
