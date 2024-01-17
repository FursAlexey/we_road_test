export default defineNuxtRouteMiddleware(async () => {
  const { getToken } = useApollo();
  const token = await getToken();

  if (!token) {
    return navigateTo('/login');
  }
});
