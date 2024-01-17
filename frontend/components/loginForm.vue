<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';

interface FormState {
  email: string;
  password: string;
}

const emit = defineEmits<{
  (e: 'onsubmit', payload: FormState): void;
}>();

const props = defineProps<{
  error?: string;
}>();

const state = reactive<FormState>({
  email: '',
  password: '',
});

const validate = (state: FormState): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: 'email', message: 'Required' });
  if (!state.password) errors.push({ path: 'password', message: 'Required' });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  emit('onsubmit', event.data);
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

    <UButton type="submit"> Submit </UButton>
  </UForm>
  <span v-show="props.error" class="error">{{ props.error }}</span>
</template>

<style lang="scss">
.error {
  color: red;
}
</style>
