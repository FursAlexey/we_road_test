<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';
import type { Role } from '~/types/__generated__/resolvers-types';
import { reactive } from 'vue';

interface FormState {
  email: string;
  password: string;
  roles: Role[];
}

const emit = defineEmits<{
  (e: 'onSubmit', payload: FormState): void;
  (e: 'onClose'): void;
}>();

const props = defineProps<{
  allRoles: Role[];
  error?: string;
}>();

const state = reactive<FormState>({
  email: '',
  password: '',
  roles: [],
});

const validate = (state: FormState): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: 'email', message: 'Required' });
  if (!state.password) errors.push({ path: 'password', message: 'Required' });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  emit('onSubmit', event.data);
}
</script>

<template>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <div class="actions">
      <UButton color="red" @click="$emit('onClose')"> Close </UButton>
      <UButton type="submit"> Submit </UButton>
    </div>
  </UForm>
  <span v-show="props.error" class="error">{{ props.error }}</span>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
