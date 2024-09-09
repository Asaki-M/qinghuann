import { resolve } from 'path'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui'],
  alias: {
    '@utils': resolve('./utils')
  },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://chinese-fonts-cdn.deno.dev/packages/yzgcxst/dist/也字工厂小石头/result.css' }
      ]
    }
  }
})
