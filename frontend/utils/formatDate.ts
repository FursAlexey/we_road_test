export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
