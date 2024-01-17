<script setup lang="ts">
import type { Role } from '~/types/__generated__/resolvers-types';

const props = defineProps<{
  isEditable: boolean;
  id: string;
  email: string;
  roles: Role[];
}>();

const emit = defineEmits<{
  (e: 'onDelete', id: string): void;
}>();
</script>

<template>
  <div class="card">
    <span>{{ props.email }}</span>
    <UButton
      v-if="props.isEditable"
      color="red"
      @click="$emit('onDelete', props.id)"
      >Delete</UButton
    >
  </div>
</template>

<style scoped>
.card {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #0f172a;
  border-radius: 0.5rem;
  background-color: #1e293b;
}
</style>
