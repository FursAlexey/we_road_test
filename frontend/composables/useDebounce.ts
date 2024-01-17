import { type Ref, watch } from 'vue';

export function useDebounce<T>(
  value: Ref<T>,
  callback: (value: T) => void,
  timeoutMs = 500,
) {
  let timeoutRef: NodeJS.Timeout | null = null;

  watch(value, (newValue: T) => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      timeoutRef = null;
    }

    timeoutRef = setTimeout(() => {
      callback(newValue);
    }, timeoutMs);
  });
}
