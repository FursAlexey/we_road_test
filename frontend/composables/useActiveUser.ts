import { ref, onMounted, onUnmounted, computed } from 'vue';
import { User, UserRole } from '~/types/__generated__/resolvers-types';
import { LocalstorageService } from '~/services/localstorage.service';

export function useActiveUser() {
  const activeUser = ref<User | null>(null);

  onMounted(() => {
    activeUser.value = LocalstorageService.getActiveUser();
  });
  onUnmounted(() => {
    activeUser.value = null;
  });

  const isAdmin = computed(() => {
    if (activeUser.value) {
      return !!activeUser.value.roles.find(
        (role) => role.name === UserRole.Admin,
      );
    }

    return false;
  });

  const isEditor = computed(() => {
    if (activeUser.value) {
      return !!activeUser.value.roles.find(
        (role) => role.name === UserRole.Editor,
      );
    }

    return false;
  });

  const isUser = computed(() => {
    return !isAdmin && !isEditor;
  });

  return { activeUser, isAdmin, isEditor, isUser };
}
