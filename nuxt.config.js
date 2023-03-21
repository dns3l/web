import pkg from './package.json'
export default {
  // ssr: process.env.NODE_ENV === 'production' ? false : (process.env.SSR || true),
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'DNS3L',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/fetchHeader.js',
    { src: '~/plugins/rmd.js', mode: 'client' }
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/tailwindcss', // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/eslint-module', // https://go.nuxtjs.dev/eslint
    '@nuxt/components'
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'portal-vue/nuxt',
    '@nuxtjs/proxy',
    '@nuxtjs/axios', // https://go.nuxtjs.dev/axios
    '@nuxtjs/auth-next' // https://dev.auth.nuxtjs.org/
  ],
  // https://nuxtjs.org/tutorials/moving-from-nuxtjs-dotenv-to-runtime-config/
  publicRuntimeConfig: {
    appVersion: process.env.VERSION || pkg.version,
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    apiURL:  process.env.API_URL  || process.env.BASE_URL + '/api',
    mockURL: process.env.MOCK_URL || process.env.BASE_URL + '/mock',
    authURL: process.env.AUTH_URL || process.env.BASE_URL + '/auth/.well-known/openid-configuration'
  },
  axios: {},
  serverMiddleware: [
    { path: '/mock', handler: '~/mock/mock.js' }
  ],
  router: {
    middleware: ['auth']
  },
  // Auth module configuration: https://dev.auth.nuxtjs.org/guide/scheme
  auth: {
    redirect: {
      login: '/',
      logout: '/',
      home: '/'
    },
    rewriteRedirects: true,
    strategies: {
      local: false,
      // This seems build time config. --> Endpoint needs to be defined at build time.
      // Auth runs properly CSR only. Keep especially in mind for Nuxt Docker deployments.
      // Thread about runtime config shim: https://github.com/nuxt-community/auth-module/discussions/1597
      dex: {
        scheme: 'openIDConnect',
        clientId: process.env.CLIENT_ID || 'dns3l-app',
        responseType: 'code',
        grantType: 'authorization_code',
        scope: ['openid', 'profile', 'email', 'groups', 'offline_access', 'audience:server:client_id:' + (process.env.DAEMON_CLIENT_ID || 'dns3ld')],
        endpoints: {
          configuration: process.env.AUTH_URL || process.env.BASE_URL + '/auth/.well-known/openid-configuration'
        }
      }
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
