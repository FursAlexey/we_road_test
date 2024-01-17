<script setup lang="ts">
import { onMounted } from 'vue';
import { ROUTES } from '~/routes';

onMounted(() => {
  navigateTo(ROUTES.Travels);
});
</script>
<template></template>
