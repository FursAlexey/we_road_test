<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type {
  CreateTravelInput,
  QueryTravelsArgs,
  Travel,
  TravelList,
  UpdateTravelInput,
} from '~/types/__generated__/resolvers-types';
import TravelsList from '~/components/travelsList.vue';
import {
  createTravelMutation,
  removeTravelMutation,
  travelsQuery,
  updateTravelMutation,
} from '~/queries';
import { useActiveUser } from '~/composables';
import { ROUTES } from '~/routes';
import TravelForm from '~/components/travelForm.vue';

definePageMeta({
  middleware: ['auth'],
});

const travels = ref<Travel[]>([]);
const queryParams = reactive<QueryTravelsArgs>({
  slug: '',
  offset: 0,
});
const isTravelFormOpened = ref(false);
const travelToUpdate = ref<Travel>();
const { load: fetchTravels, refetch: refetchTravels } = useLazyQuery<
  {
    travels: TravelList;
  },
  QueryTravelsArgs
>(
  travelsQuery,
  {
    slug: queryParams.slug,
    offset: queryParams.offset,
    limit: queryParams.limit,
  },
  {
    fetchPolicy: 'network-only',
  },
);
const { mutate: createTravel } = useMutation<
  {
    createTravel: Travel;
  },
  {
    createTravelInput: CreateTravelInput;
  }
>(createTravelMutation);
const { mutate: updateTravel } = useMutation<
  {
    updateTravel: Travel;
  },
  {
    updateTravelInput: UpdateTravelInput;
  }
>(updateTravelMutation);
const { mutate: removeTravel } = useMutation(removeTravelMutation);

const { isAdmin, isEditor } = useActiveUser();
const hasMore = ref(false);

const fetchMoreTravels = async () => {
  if (typeof queryParams.offset === 'number') {
    queryParams.offset++;
  }

  const response = await refetchTravels({
    slug: queryParams.slug,
    limit: queryParams.limit,
    offset: queryParams.offset,
  });

  if (response) {
    const nextTravels = response.data.travels.data;

    travels.value = [...travels.value, ...nextTravels];
    hasMore.value = response.data.travels.hasMore;
  }
};

const handleShowTravelDetails = (id: string) => {
  navigateTo(`${ROUTES.Travels}/${id}${ROUTES.Tours}`);
};

const handleEditTravelClick = (id: string) => {
  travelToUpdate.value = travels.value.find((travel) => travel.id === id);
  isTravelFormOpened.value = true;
};

const handleTravelDelete = async (id: string) => {
  await removeTravel({
    id,
  });

  travels.value = travels.value.filter((travel) => travel.id !== id);
};

const handleSearchChange = async (search: string) => {
  queryParams.slug = search;
  queryParams.offset = 0;

  const response = await refetchTravels({
    slug: queryParams.slug,
    limit: queryParams.limit,
    offset: queryParams.offset,
  });

  if (response) {
    travels.value = response.data.travels.data;
    hasMore.value = response.data.travels.hasMore;
  }
};

const handleCreateTravel = async (payload: CreateTravelInput) => {
  const response = await createTravel({
    createTravelInput: payload,
  });

  if (response?.data) {
    travels.value = [...travels.value, response.data.createTravel];
  }

  isTravelFormOpened.value = false;
};

const handleUpdateTravel = async (payload: UpdateTravelInput) => {
  const response = await updateTravel({
    updateTravelInput: payload,
  });

  if (response?.data) {
    const updatedTravel = response.data.updateTravel;

    travels.value = travels.value.map((travel) =>
      travel.id === updatedTravel.id ? updatedTravel : travel,
    );
  }

  isTravelFormOpened.value = false;
};

const handleTravelFormSubmit = (payload: CreateTravelInput) => {
  if (travelToUpdate.value) {
    handleUpdateTravel({
      id: travelToUpdate.value.id,
      ...payload,
    });
  } else {
    handleCreateTravel(payload);
  }
};

const handleCloseTravelForm = () => {
  isTravelFormOpened.value = false;
  travelToUpdate.value = undefined;
};

onMounted(async () => {
  const response = await fetchTravels();

  if (response) {
    travels.value = response.travels.data;
    hasMore.value = response.travels.hasMore;
  }
});
</script>

<template>
  <div class="container">
    <NuxtLayout name="common">
      <TravelsList
        :travels="travels"
        :has-more="hasMore"
        :can-be-edited="isEditor"
        :can-be-deleted="isAdmin"
        :can-create="isAdmin"
        @on-more-click="fetchMoreTravels"
        @on-view-click="handleShowTravelDetails"
        @on-edit-click="handleEditTravelClick"
        @on-delete-click="handleTravelDelete"
        @on-search-change="handleSearchChange"
        @on-create-click="isTravelFormOpened = true"
      />

      <UModal v-model="isTravelFormOpened" prevent-close>
        <div class="p-4">
          <TravelForm
            :travel-to-edit="travelToUpdate"
            @on-submit="handleTravelFormSubmit"
            @on-cancel="handleCloseTravelForm"
          />
        </div>
      </UModal>
    </NuxtLayout>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
