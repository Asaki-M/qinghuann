import { resolve } from 'path'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  modules: ['@nuxt/ui'],
  css: [
    '~/assets/styles/common.scss'
  ],
  alias: {
    '@utils': resolve('./utils')
  },
})
