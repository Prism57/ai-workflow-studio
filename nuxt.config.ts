// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

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
    redirect: false
  },

  runtimeConfig: {
    glmApiKey: process.env.GLM_API_KEY,
    glmApiUrl:
      process.env.GLM_API_URL ||
      'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  }
})
