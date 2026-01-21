// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // 服务器配置 - 解决 Windows 上 IPv6 地址无法访问问题
  devServer: {
    host: 'localhost'
  },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/supabase'],

  css: ['~/assets/css/main.css'],

  // 组件自动导入配置
  components: [
    {
      path: '~/components/ui',
      extensions: ['.vue'],
      prefix: 'Ui',
      pathPrefix: false // 避免双重命名如 'UiButtonButton'
    },
    '~/components' // 其他组件正常扫描
  ],

  imports: {
    dirs: ['stores', 'composables', 'utils']
  },

  supabase: {
    redirect: false,
    // 确保回调能正确处理
    redirectOptions: {
      login: '/login',
      callback: '/confirm'
    }
  },

  // 路由规则配置
  routeRules: {
    // 禁用 run 页面的 SSR，完全在客户端渲染
    '/prompts/**/run': { ssr: false },
    // 禁用 index 页面的 SSR
    '/prompts/**/index': { ssr: false },
    // 主页也禁用了 SSR 数据获取，可以考虑也在这里禁用，或者保留页面骨架
    '/': { ssr: false }
  },

  runtimeConfig: {
    glmApiKey: process.env.GLM_API_KEY,
    glmApiUrl:
      process.env.GLM_API_URL ||
      'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  }
})
