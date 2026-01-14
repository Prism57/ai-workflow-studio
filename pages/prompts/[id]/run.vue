<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
      <NuxtLink
        to="/"
        class="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors shrink-0"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </NuxtLink>
      <div class="min-w-0">
        <h1 class="text-lg sm:text-xl font-semibold text-foreground truncate">
          {{ prompt?.name || '执行 Prompt' }}
        </h1>
        <p class="text-muted-foreground text-sm hidden sm:block">
          填写变量并执行
        </p>
      </div>
    </div>

    <!-- Two Column Layout - Stacks on Mobile -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- Left: Input Panel -->
      <div class="space-y-4 sm:space-y-6">
        <div class="card p-4 sm:p-5">
          <h2 class="text-sm font-medium text-foreground mb-3">Prompt 内容</h2>
          <pre
            class="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap font-mono bg-muted p-3 sm:p-4 rounded-md max-h-48 sm:max-h-64 overflow-auto"
            >{{ prompt?.content }}</pre
          >
        </div>

        <!-- Variables -->
        <div v-if="variables.length" class="card p-4 sm:p-5">
          <h2 class="text-sm font-medium text-foreground mb-4">变量输入</h2>
          <div class="space-y-4">
            <div v-for="variable in variables" :key="variable">
              <label class="block text-sm font-medium text-foreground mb-2">
                {{ variable }}
              </label>
              <input
                v-model="variableValues[variable]"
                type="text"
                :placeholder="`输入 ${variable}`"
                class="input"
              />
            </div>
          </div>
        </div>

        <!-- Execute Button -->
        <button
          @click="executePrompt"
          :disabled="isExecuting"
          class="w-full btn-primary py-3 text-base justify-center"
        >
          <svg
            v-if="!isExecuting"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
          {{ isExecuting ? '执行中...' : '执行 Prompt' }}
        </button>
      </div>

      <!-- Right: Output Panel -->
      <div class="card p-4 sm:p-5 min-h-[300px] lg:min-h-0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-medium text-foreground">AI 响应</h2>
          <button
            v-if="result"
            @click="copyResult"
            class="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            复制
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-if="!result && !error"
          class="text-center py-12 sm:py-16 text-muted-foreground"
        >
          <svg
            class="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p class="text-sm">点击执行按钮查看 AI 响应</p>
        </div>

        <!-- Error -->
        <div
          v-else-if="error"
          class="bg-destructive/5 border border-destructive/20 rounded-md p-4 text-destructive text-sm"
        >
          {{ error }}
        </div>

        <!-- Result -->
        <div v-else>
          <pre
            class="text-xs sm:text-sm text-foreground whitespace-pre-wrap bg-muted p-3 sm:p-4 rounded-md max-h-[400px] sm:max-h-[500px] overflow-auto"
            >{{ result }}</pre
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute()
  const client = useSupabaseClient()
  const promptId = route.params.id as string

  const { data: prompt } = await useAsyncData(
    `prompt-run-${promptId}`,
    async () => {
      const { data, error } = await client
        .from('prompts')
        .select('*')
        .eq('id', promptId)
        .single()

      if (error) throw error
      return data as any
    }
  )

  const variables = computed(() => {
    if (!prompt.value?.content) return []
    const matches = prompt.value.content.match(/\{\{(\w+)\}\}/g) || []
    return [...new Set(matches.map((m: string) => m.slice(2, -2)))]
  })

  const variableValues = reactive<Record<string, string>>({})
  const isExecuting = ref(false)
  const result = ref('')
  const error = ref('')

  async function executePrompt() {
    if (!prompt.value) return

    isExecuting.value = true
    result.value = ''
    error.value = ''

    try {
      let content = prompt.value.content
      for (const [key, value] of Object.entries(variableValues)) {
        content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
      }

      const response = await $fetch('/api/ai/execute', {
        method: 'POST',
        body: {
          content,
          parameters: prompt.value.parameters || {}
        }
      })

      result.value = (response as any).result || ''
    } catch (e: any) {
      error.value = e.data?.message || e.message || '执行失败'
    } finally {
      isExecuting.value = false
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result.value)
  }
</script>
