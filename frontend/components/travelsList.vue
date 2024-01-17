<script setup lang="ts">
import { ref } from 'vue';
import type { Travel } from '~/types/__generated__/resolvers-types';
import { useDebounce } from '~/composables';

const columns = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'numberOfDays',
    label: 'Days',
  },
  {
    key: 'numberOfNights',
    label: 'Nights',
  },
  {
    key: 'actions',
    label: 'Action',
  },
];

const props = defineProps<{
  travels: Travel[];
  hasMore: boolean;
  canBeEdited: boolean;
  canBeDeleted: boolean;
}>();

const emit = defineEmits<{
  (e: 'onMoreClick'): void;
  (e: 'onDetailsClick', id: string): void;
  (e: 'onEditClick', id: string): void;
  (e: 'onDeleteClick', id: string): void;
  (e: 'onSearchChange', value: string): void;
  (e: 'onCreateClick'): void;
}>();

const actions = (row: { id: string }) => {
  const allowedActions = [
    {
      label: 'Details',
      icon: 'i-heroicons-arrow-right-circle-20-solid',
      click: () => emit('onDetailsClick', row.id),
    },
  ];

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

const search = ref('');

useDebounce(search, (debounceSearch) => {
  emit('onSearchChange', debounceSearch);
});
</script>

<template>
  <div class="container">
    <div
      class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
    >
      <UInput v-model="search" placeholder="Filter travels..." />
      <UButton @click="$emit('onCreateClick')">Create</UButton>
    </div>

    <UTable :rows="travels" :columns="columns">
      <template #actions-data="{ row }">
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
      <UButton v-if="hasMore" @click="$emit('onMoreClick')">Show more</UButton>
    </div>
  </div>
</template>
<style scoped></style>
