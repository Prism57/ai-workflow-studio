<template>
  <div
    class="min-h-screen bg-zinc-50 flex items-center justify-center p-4"
    style="background-color: #fafafa"
  >
    <div class="text-center">
      <div
        class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4"
      >
        <svg
          class="w-6 h-6 text-white animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <p class="text-muted-foreground">正在完成登录...</p>
      <p v-if="error" class="mt-4 text-destructive text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * OAuth 回调确认页面
   * @nuxtjs/supabase 模块会自动处理 URL 中的授权码并建立会话
   * 这个页面只需要等待会话建立完成后跳转
   */
  definePageMeta({
    layout: false
  })

  const route = useRoute()
  const user = useSupabaseUser()
  const error = ref('')

  // 等待 Supabase 处理回调后跳转
  watchEffect(() => {
    if (user.value) {
      navigateTo('/')
    }
  })

  // 处理 URL 中的错误参数
  onMounted(async () => {
    // 检查 URL 中是否有错误信息
    if (route.query.error) {
      error.value = (route.query.error_description as string) || '登录失败'
      setTimeout(() => navigateTo('/login'), 3000)
      return
    }

    // 如果 URL 中有 code，Supabase 模块会自动处理
    // 设置一个较长的超时，给模块足够时间处理
    setTimeout(() => {
      if (!user.value) {
        error.value = '登录超时，请重试'
        setTimeout(() => navigateTo('/login'), 2000)
      }
    }, 15000)
  })
</script>
