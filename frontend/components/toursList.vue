<script setup lang="ts">
import type { Tour } from '~/types/__generated__/resolvers-types';

const columns = [
  {
    key: 'price',
    label: 'Price',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'startingDate',
    label: 'Staring Date',
  },
  {
    key: 'endingDate',
    label: 'Ending Date',
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
</script>

<template>
  <div>
    <UTable :rows="tours" :columns="columns">
      <template
        v-if="props.canBeDeleted || props.canBeEdited"
        #actions-data="{ row }"
      >
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
      <UButton color="violet" v-if="props.hasMore" @click="$emit('onMoreClick')"
        >Show more</UButton
      >
    </div>
  </div>
</template>
<style scoped></style>
