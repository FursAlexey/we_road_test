<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from '~/components/loginForm.vue';
import type { User } from '~/types/__generated__/resolvers-types';
import { LocalstorageService } from '~/services/localstorage.service';
import { activeUserQuery, loginQuery } from '~/queries';
import { ROUTES } from '~/routes';

const { mutate } = useMutation(loginQuery);
const { onLogin } = useApollo();
const { load: getActiveUser } = useLazyQuery(activeUserQuery);

const error = ref<string>('');

async function handleLogin(payload: any) {
  error.value = '';

  try {
    const response = await mutate({
      loginInput: {
        email: payload.email,
        password: payload.password,
      },
    });

    const token = response?.data.login;

    await onLogin(token);

    const result = await getActiveUser();
    const user: User = result.me;

    if (user) {
      LocalstorageService.setActiveUser(user);
    }

    navigateTo(ROUTES.Travels);
  } catch (err) {
    const e = err as Error;
    error.value = e.message;
  }
}
</script>

<template>
  <div class="container">
    <div class="loginWrapper">
      <h1>We Road</h1>
      <LoginForm @onsubmit="handleLogin" :error="error" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .loginWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1rem;

    h1 {
      font-size: 2rem;
    }
  }
}
</style>
