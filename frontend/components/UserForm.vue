<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';
import type {
  CreateUserInput,
  Role,
  User,
} from '~/types/__generated__/resolvers-types';
import { computed, reactive } from 'vue';

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
  userToEdit?: User;
  roles: Role[];
  error?: string;
}>();

const state = reactive<FormState>({
  email: '',
  password: '',
  roles: props.userToEdit?.roles ? props.userToEdit.roles : [],
});

const validate = (state: FormState): FormError[] => {
  const errors = [];
  // if (!state.email) errors.push({ path: 'email', message: 'Required' });
  // if (!state.password) errors.push({ path: 'password', message: 'Required' });
  return errors;
};

const selectedRolesLabel = computed(() => {
  console.log('state.roles: ', state.roles);
  return state.roles.map(({ name }) => name).join(',');
});

const onSubmit = async (event: FormSubmitEvent<FormState>) => {
  emit('onSubmit', event.data);
};
</script>

<template>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup v-if="!props.userToEdit" label="Email" name="email">
      <UInput v-model="state.email" autocomplete="off" />
    </UFormGroup>

    <UFormGroup v-if="!props.userToEdit" label="Password" name="password">
      <UInput v-model="state.password" type="password" autocomplete="off" />
    </UFormGroup>

    <UFormGroup label="Roles" name="roles">
      <USelectMenu
        v-model="state.roles"
        :options="props.roles"
        option-attribute="name"
        multiple
        by="id"
        placeholder="Select roles"
      >
        <template #label>
          <span v-if="state.roles.length" class="truncate">{{
            selectedRolesLabel
          }}</span>
          <span v-else>Select roles</span>
        </template>
      </USelectMenu>
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
