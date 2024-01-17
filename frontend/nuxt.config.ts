export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  modules: ['@nuxt/ui', '@nuxtjs/apollo'],
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'http://localhost:8000/graphql',
        httpLinkOptions: {
          credentials: 'include'
        }
      }
    },
  },
})
