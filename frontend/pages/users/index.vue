<script setup lang="ts">
import type {
  CreateUserInput,
  Role,
  UpdateUserRolesInput,
  User,
} from '~/types/__generated__/resolvers-types';
import UserCard from '~/components/userCard.vue';
import { useActiveUser } from '~/composables/useActiveUser';
import { onMounted, ref } from 'vue';
import CreateUserForm from '~/components/UserForm.vue';
import {
  createUserMutation,
  removeUserMutation,
  rolesQuery,
  updateUserRolesMutation,
  usersQuery,
} from '~/queries';
import UsersList from '~/components/usersList.vue';

definePageMeta({
  middleware: ['auth'],
});

const { load: fetchUsers } = useLazyQuery(usersQuery, undefined, {
  fetchPolicy: 'network-only',
});
const { load: fetchRoles } = useLazyQuery(rolesQuery, undefined, {
  fetchPolicy: 'network-only',
});
const { mutate: createUser } = useMutation(createUserMutation);
const { mutate: updateUserRoles } = useMutation(updateUserRolesMutation);
const { mutate: removeUser } = useMutation(removeUserMutation);
const { isAdmin, isEditor, activeUser } = useActiveUser();
const isUserFormOpened = ref(false);
const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const userToEdit = ref<User>();

const createNewUser = async (payload: CreateUserInput) => {
  const response = await createUser({
    createUserInput: payload,
  });

  if (response) {
    const newUser = response.data.createUser as User;

    users.value = [...users.value, newUser];
  }

  handleCloseUserForm();
};

const updateRoles = async (payload: UpdateUserRolesInput) => {
  const response = await updateUserRoles({
    updateUserRolesInput: payload,
  });

  if (response?.data) {
    const updatedUser: User = response.data.updateUserRoles;
    users.value = users.value.map((user) =>
      user.id === updatedUser.id ? updatedUser : user,
    );
  }

  handleCloseUserForm();
};

const handleUserEditClick = (id: string) => {
  userToEdit.value = users.value.find((user) => user.id === id);
  isUserFormOpened.value = true;
};

const handleUserDeleteClick = async (id: string) => {
  await removeUser({
    id,
  });

  users.value = users.value.filter((user) => user.id !== id);
};

const handleCloseUserForm = () => {
  isUserFormOpened.value = false;
  userToEdit.value = undefined;
};

const handleUserFormSubmit = (payload: {
  email: string;
  password: string;
  roles: Role[];
}) => {
  const roleIds = payload.roles.map(({ id }) => id);

  if (userToEdit.value) {
    updateRoles({
      id: userToEdit.value.id,
      roleIds,
    });
  } else {
    createNewUser({
      email: payload.email,
      password: payload.password,
      roleIds,
    });
  }
};

onMounted(async () => {
  const fetchUsersResponse = await fetchUsers();
  const fetchRolesResponse = await fetchRoles();

  users.value = fetchUsersResponse.users.filter(
    (user: User) => user.id !== activeUser.value?.id,
  );
  roles.value = fetchRolesResponse.roles;
});
</script>

<template>
  <div class="container">
    <NuxtLayout name="common">
      <div class="content">
        <div v-if="isAdmin">
          <UButton @click="isUserFormOpened = true">Create</UButton>
        </div>
        <UsersList
          :users="users"
          :can-be-edited="isEditor"
          :can-be-deleted="isAdmin"
          @on-delete-click="handleUserDeleteClick"
          @on-edit-click="handleUserEditClick"
        />
      </div>

      <UModal v-model="isUserFormOpened" prevent-close>
        <div :class="['p-4', userToEdit && 'h-48']">
          <CreateUserForm
            :user-to-edit="userToEdit"
            :roles="roles"
            @on-submit="handleUserFormSubmit"
            @on-close="handleCloseUserForm"
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
