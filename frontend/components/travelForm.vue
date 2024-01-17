<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';
import type {
  CreateTravelInput,
  Travel,
} from '~/types/__generated__/resolvers-types';

const emit = defineEmits<{
  (e: 'onSubmit', payload: CreateTravelInput): void;
  (e: 'onCancel'): void;
}>();

const props = defineProps<{
  travelToEdit?: Travel;
  error?: string;
}>();

const state = reactive<CreateTravelInput>({
  name: props.travelToEdit?.name ?? '',
  description: props.travelToEdit?.description ?? '',
  isPublic: props.travelToEdit?.isPublic ?? true,
  numberOfDays: props.travelToEdit?.numberOfDays ?? 0,
  moods: {
    culture: props.travelToEdit?.moods.culture ?? 0,
    history: props.travelToEdit?.moods.history ?? 0,
    nature: props.travelToEdit?.moods.nature ?? 0,
    party: props.travelToEdit?.moods.party ?? 0,
    relax: props.travelToEdit?.moods.relax ?? 0,
  },
});

const validate = (state: CreateTravelInput): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: 'name', message: 'Required' });
  if (!state.description)
    errors.push({ path: 'description', message: 'Required' });
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
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <UInput v-model="state.description" />
    </UFormGroup>

    <UFormGroup label="Number of days" name="numberOfDays">
      <UInput v-model.number="state.numberOfDays" />
    </UFormGroup>

    <UFormGroup label="Culture" name="culture">
      <UInput v-model.number="state.moods.culture" />
    </UFormGroup>

    <UFormGroup label="History" name="history">
      <UInput v-model.number="state.moods.history" />
    </UFormGroup>

    <UFormGroup label="Nature" name="nature">
      <UInput v-model.number="state.moods.nature" />
    </UFormGroup>

    <UFormGroup label="Party" name="party">
      <UInput v-model.number="state.moods.party" />
    </UFormGroup>

    <UFormGroup label="Relax" name="relax">
      <UInput v-model.number="state.moods.relax" />
    </UFormGroup>

    <div class="flex justify-between">
      <UButton type="button" color="red" @click="$emit('onCancel')"
        >Cancel</UButton
      >
      <UButton type="submit">Submit</UButton>
    </div>
  </UForm>
  <span v-show="props.error" class="error">{{ props.error }}</span>
</template>

<style lang="scss">
.error {
  color: red;
}
</style>
