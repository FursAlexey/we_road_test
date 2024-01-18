<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';
import type {
  CreateTourInput,
  Tour,
} from '~/types/__generated__/resolvers-types';
import { formatDate } from '~/utils';

interface FormState extends Omit<CreateTourInput, 'travelId'> {}

const emit = defineEmits<{
  (e: 'onSubmit', payload: FormState): void;
  (e: 'onCancel'): void;
}>();

const props = defineProps<{
  tourToEdit?: Tour;
  error?: string;
}>();

const state = reactive<FormState>({
  name: props.tourToEdit?.name ?? '',
  startingDate: props.tourToEdit
    ? new Date(props.tourToEdit.startingDate)
    : new Date(),
  endingDate: props.tourToEdit
    ? new Date(props.tourToEdit.endingDate)
    : new Date(),
  price: props.tourToEdit?.price ?? 0,
});

const validate = (state: FormState): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: 'name', message: 'Required' });

  return errors;
};

async function onSubmit(event: FormSubmitEvent<FormState>) {
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

    <div class="flex justify-between">
      <UFormGroup label="Starting date" name="startingDate">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="formatDate(state.startingDate)"
          />

          <template #panel="{ close }">
            <LazyDatePicker v-model="state.startingDate" @close="close" />
          </template>
        </UPopover>
      </UFormGroup>

      <UFormGroup label="Ending date" name="endingDate">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="formatDate(state.endingDate)"
          />

          <template #panel="{ close }">
            <LazyDatePicker v-model="state.endingDate" @close="close" />
          </template>
        </UPopover>
      </UFormGroup>
    </div>

    <UFormGroup label="Price" name="price">
      <UInput
        v-model="state.price"
        type="number"
        step="0.01"
      />
    </UFormGroup>

    <div class="flex justify-between">
      <UButton type="button" color="red" @click="$emit('onCancel')"
        >Cancel</UButton
      >
      <UButton type="submit">Submit</UButton>
    </div>
    <span v-if="props.error" class="accent-red-500">{{ props.error }}</span>
  </UForm>
  <span v-show="props.error" class="error">{{ props.error }}</span>
</template>

<style lang="scss">

</style>
