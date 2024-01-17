<script setup lang="ts">
import Navigation from '~/components/navigation.vue';
import { LocalstorageService } from '~/services/localstorage.service';

const activeUser = LocalstorageService.getActiveUser();
</script>

<template>
  <div class="sidebar">
    <span>{{ activeUser?.email }}</span>
    <Navigation />
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 100%;
  padding: 1rem 1.5rem;

  h2 {
    font-size: 1.5rem;
  }
}
</style>
