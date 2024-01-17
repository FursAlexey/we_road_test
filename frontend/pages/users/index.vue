<script setup lang="ts">
import type {
  CreateUserInput,
  User,
} from '~/types/__generated__/resolvers-types';
import UserCard from '~/components/userCard.vue';
import { useActiveUser } from '~/composables/useActiveUser';
import { onMounted, ref } from 'vue';
import CreateUserForm from '~/components/createUserForm.vue';
import { createUserMutation, removeUserMutation, usersQuery } from '~/queries';

definePageMeta({
  middleware: ['auth'],
});

const { load: fetchUsers } = useLazyQuery(usersQuery, undefined, {
  fetchPolicy: 'network-only',
});
const { mutate: createUser } = useMutation(createUserMutation);
const { mutate: removeUser } = useMutation(removeUserMutation);
const { isAdmin, activeUser } = useActiveUser();
const isAddUserFormOpened = ref(false);
const users = ref<User[]>([]);

async function createNewUser(payload: any): Promise<void> {
  const variables: CreateUserInput = {
    email: payload.email,
    password: payload.password,
    roleIds: [],
  };
  const response = await createUser({
    createUserInput: variables,
  });

  if (response) {
    const newUser = response.data.createUser as User;

    users.value = [...users.value, newUser];
  }

  isAddUserFormOpened.value = false;
}

async function onUserDelete(id: string): Promise<void> {
  await removeUser({
    id,
  });

  users.value = users.value.filter((user) => user.id !== id);
}

onMounted(async () => {
  const result = await fetchUsers();

  users.value = result.users.filter((user: User) => user.id !== activeUser.value?.id);
});
</script>

<template>
  <div class="container">
    <NuxtLayout name="common">
      <div class="content">
        <div v-if="isAdmin">
          <UButton size="xl" @click="isAddUserFormOpened = true">Add</UButton>
        </div>
        <template v-for="user in users">
          <UserCard
            :roles="user.roles"
            :id="user.id"
            :email="user.email"
            :is-editable="isAdmin"
            @on-delete="onUserDelete"
          />
        </template>
      </div>

      <UModal v-model="isAddUserFormOpened" prevent-close>
        <div class="p-4">
          <CreateUserForm
            :all-roles="[]"
            @on-submit="createNewUser"
            @on-close="isAddUserFormOpened = false"
          />
        </div>
      </UModal>
    </NuxtLayout>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
.content {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}
</style>
