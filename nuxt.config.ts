import { resolve } from 'path'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxt/image'],
  content: {
    markdown: {
      anchorLinks: false // 禁用标题自动生成锚点链接
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
