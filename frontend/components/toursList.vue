<script setup lang="ts">
import { type SortArgs, SortDirection, type Tour } from '~/types/__generated__/resolvers-types';
import { computed, watch } from 'vue';

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const columns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'price',
    label: 'Price',
    sortable: true,
  },
  {
    key: 'startingDate',
    label: 'Staring Date',
    sortable: true,
  },
  {
    key: 'endingDate',
    label: 'Ending Date',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Action',
  },
];

const props = defineProps<{
  tours: Tour[];
  hasMore: boolean;
  canBeEdited?: boolean;
  canBeDeleted?: boolean;
}>();

const emit = defineEmits<{
  (e: 'onMoreClick'): void;
  (e: 'onEditClick', id: string): void;
  (e: 'onDeleteClick', id: string): void;
  (e: 'onSortChange', sort: SortArgs): void;
}>();

const sort = ref<{
  column: string;
  direction: 'asc' | 'desc';
}>();

const actions = (row: { id: string }) => {
  const allowedActions = [];

  if (props.canBeEdited) {
    allowedActions.push({
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => emit('onEditClick', row.id),
    });
  }

  if (props.canBeDeleted) {
    allowedActions.push({
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => emit('onDeleteClick', row.id),
    });
  }

  return [allowedActions];
};

watch(sort, (value) => {
  if (value && value.column) {
    emit('onSortChange', {
      field: value.column,
      direction: value.direction.toUpperCase() as SortDirection,
    });
  }
});

const rows = computed(() =>
  props.tours.map((tour) => ({
    ...tour,
    startingDate: formatDate(new Date(tour.startingDate)),
    endingDate: formatDate(new Date(tour.endingDate)),
  })),
);
</script>

<template>
  <div>
    <UTable
      v-model:sort="sort"
      :rows="rows"
      :columns="columns"
      sort-mode="manual"
    >
      <template v-if="actions.length > 0" #actions-data="{ row }">
        <UDropdown :items="actions(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>

    <div
      class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UButton v-if="props.hasMore" @click="$emit('onMoreClick')"
        >Show more</UButton
      >
    </div>
  </div>
</template>
<style scoped></style>
