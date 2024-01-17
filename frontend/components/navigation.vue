<script setup lang="ts">
import { RouteName, ROUTES } from '~/routes';
import { LocalstorageService } from '~/services/localstorage.service';
import { useActiveUser } from '~/composables/useActiveUser';

const { isAdmin } = useActiveUser();
const { onLogout } = useApollo();

const links = computed(() => {
  const allowedLinks = [
    {
      label: RouteName.Travels,
      to: ROUTES[RouteName.Travels],
    },
  ];

  if (isAdmin.value) {
    allowedLinks.push({
      label: RouteName.Users,
      to: ROUTES[RouteName.Users],
    });
  }

  return allowedLinks;
});

async function logout() {
  onLogout();
  LocalstorageService.setActiveUser(null);
  navigateTo(ROUTES.Login);
}
</script>

<template>
  <div class="container">
    <UVerticalNavigation :links="links">
      <template #default="{ link }">
        <span class="group-hover:text-primary relative">{{ link.label }}</span>
      </template>
    </UVerticalNavigation>
    <UButton color="red" variant="ghost" @click="logout">Logout</UButton>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>
