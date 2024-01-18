<script setup lang="ts">
import type { User } from '~/types/__generated__/resolvers-types';
import { computed } from 'vue';

const columns = [
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'roles',
    label: 'Roles',
  },
  {
    key: 'actions',
    label: 'Action',
  },
];

const props = defineProps<{
  users: User[];
  canBeEdited?: boolean;
  canBeDeleted?: boolean;
}>();

const emit = defineEmits<{
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

const rows = computed(() =>
  props.users.map((user) => ({
    ...user,
    roles: user.roles.map(({ name }) => name).join('; '),
  })),
);

console.log('rows: ', rows);
</script>

<template>
  <div>
    <UTable :rows="rows" :columns="columns">
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
  </div>
</template>
<style scoped></style>
