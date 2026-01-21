<template>
  <div
    class="min-h-screen bg-zinc-50 flex items-center justify-center p-4"
    style="background-color: #fafafa"
  >
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4"
        >
          <svg
            width="24"
            height="24"
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h1 class="text-2xl font-semibold text-foreground">
          AI Workflow Studio
        </h1>
        <p class="text-muted-foreground mt-1">构建、测试和部署 AI 工作流</p>
      </div>

      <!-- Login Card -->
      <Card class="p-8">
        <CardHeader class="p-0 pb-6">
          <CardTitle class="text-center">登录以继续</CardTitle>
        </CardHeader>
        <CardContent class="p-0">
          <!-- GitHub Login Button -->
          <Button
            @click="loginWithGitHub"
            :disabled="isLoading"
            class="w-full"
            size="lg"
          >
            <svg
              v-if="!isLoading"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5 animate-spin"
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
            {{ isLoading ? '登录中...' : '使用 GitHub 登录' }}
          </Button>

          <!-- Error Message -->
          <p v-if="errorMsg" class="mt-4 text-center text-destructive text-sm">
            {{ errorMsg }}
          </p>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-border"></div>
            <span class="text-muted-foreground text-sm">或</span>
            <div class="flex-1 h-px bg-border"></div>
          </div>

          <!-- Demo Notice -->
          <p class="text-center text-muted-foreground text-sm">
            这是一个 AI 练手项目，仅支持 GitHub 登录
          </p>
        </CardContent>
      </Card>

      <!-- Footer -->
      <p class="text-center text-muted-foreground text-xs mt-8">
        © 2024 AI Workflow Studio
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Button } from '@/components/ui/button'
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
  } from '@/components/ui/card'

  definePageMeta({
    layout: false
  })

  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const isLoading = ref(false)
  const errorMsg = ref('')

  watch(
    user,
    newUser => {
      if (newUser) {
        navigateTo('/')
      }
    },
    { immediate: true }
  )

  async function loginWithGitHub() {
    isLoading.value = true
    errorMsg.value = ''

    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'github',
        options: {
          // 回调到服务端 API 路由处理授权码交换
          redirectTo: `${window.location.origin}/api/auth/callback`
        }
      })

      if (error) {
        errorMsg.value = error.message
      }
    } catch (e) {
      errorMsg.value = e instanceof Error ? e.message : '登录失败'
    } finally {
      isLoading.value = false
    }
  }
</script>
