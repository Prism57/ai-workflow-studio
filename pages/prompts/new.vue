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
      <h1 class="text-lg sm:text-xl font-semibold text-foreground">
        新建 Prompt
      </h1>
    </div>

    <!-- Form -->
    <form
      @submit.prevent="handleSubmit"
      class="max-w-2xl space-y-5 sm:space-y-6"
    >
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2"
          >名称</label
        >
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="给你的 Prompt 起个名字"
          class="input"
        />
      </div>

      <!-- Content -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2"
          >内容</label
        >
        <textarea
          v-model="form.content"
          required
          rows="8"
          placeholder="输入你的 Prompt 内容，可以使用 {{变量名}} 作为占位符"
          class="textarea font-mono text-sm"
        ></textarea>
        <p class="mt-2 text-xs sm:text-sm text-muted-foreground">
          提示：使用
          <code class="px-1 py-0.5 bg-muted rounded text-foreground"
            >&#123;&#123;变量名&#125;&#125;</code
          >
          定义变量
        </p>
      </div>

      <!-- Parameters (JSON) -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          参数配置 <span class="text-muted-foreground">(可选)</span>
        </label>
        <textarea
          v-model="form.parametersStr"
          rows="4"
          placeholder='{"temperature": 0.7, "max_tokens": 1000}'
          class="textarea font-mono text-sm"
        ></textarea>
      </div>

      <!-- Submit - Responsive -->
      <div
        class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2"
      >
        <NuxtLink to="/" class="btn-ghost text-center justify-center">
          取消
        </NuxtLink>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="btn-primary flex-1 sm:flex-none justify-center"
        >
          {{ isSubmitting ? '保存中...' : '保存 Prompt' }}
        </button>
      </div>

      <!-- Error -->
      <p v-if="errorMsg" class="text-destructive text-sm">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  const form = reactive({
    name: '',
    content: '',
    parametersStr: '{\n  "temperature": 0.7,\n  "max_tokens": 1000\n}'
  })

  const isSubmitting = ref(false)
  const errorMsg = ref('')

  async function handleSubmit() {
    if (!user.value) {
      errorMsg.value = '请先登录'
      return
    }

    isSubmitting.value = true
    errorMsg.value = ''

    try {
      let parameters = {}
      try {
        parameters = JSON.parse(form.parametersStr || '{}')
      } catch {
        errorMsg.value = '参数格式错误，请输入有效的 JSON'
        isSubmitting.value = false
        return
      }

      const { error } = await client.from('prompts').insert({
        name: form.name,
        content: form.content,
        parameters,
        user_id: user.value.id
      } as any)

      if (error) throw error

      navigateTo('/')
    } catch (e) {
      errorMsg.value = e instanceof Error ? e.message : '保存失败'
    } finally {
      isSubmitting.value = false
    }
  }
</script>
