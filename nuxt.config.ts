import { resolve } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxt/image', 'vite-plugin-auto-import-styles/nuxt'],
  content: {
    markdown: {
      anchorLinks: false,
      tags: {
        img: 'ProseImg'
      }
    }
  },
  css: [
    '~/assets/styles/common.scss'
  ],
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
