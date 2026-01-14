<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink
        to="/"
        class="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
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
      <h1 class="text-xl font-semibold text-foreground">编辑 Prompt</h1>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div
        class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Form -->
    <form
      v-else-if="prompt"
      @submit.prevent="handleSubmit"
      class="max-w-2xl space-y-6"
    >
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2"
          >名称</label
        >
        <input v-model="form.name" type="text" required class="input" />
      </div>

      <!-- Content -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2"
          >内容</label
        >
        <textarea
          v-model="form.content"
          required
          rows="10"
          class="textarea font-mono text-sm"
        ></textarea>
      </div>

      <!-- Parameters -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2"
          >参数配置</label
        >
        <textarea
          v-model="form.parametersStr"
          rows="4"
          class="textarea font-mono text-sm"
        ></textarea>
      </div>

      <!-- Submit -->
      <div class="flex items-center gap-4">
        <button type="submit" :disabled="isSubmitting" class="btn-primary">
          {{ isSubmitting ? '保存中...' : '保存修改' }}
        </button>
        <NuxtLink to="/" class="btn-ghost">取消</NuxtLink>
      </div>

      <p v-if="errorMsg" class="text-destructive text-sm">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute()
  const client = useSupabaseClient()
  const promptId = route.params.id as string

  const { data: prompt, pending } = await useAsyncData(
    `prompt-${promptId}`,
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

  const form = reactive({
    name: '',
    content: '',
    parametersStr: ''
  })

  const isSubmitting = ref(false)
  const errorMsg = ref('')

  watch(
    prompt,
    p => {
      if (p) {
        form.name = p.name
        form.content = p.content
        form.parametersStr = JSON.stringify(p.parameters || {}, null, 2)
      }
    },
    { immediate: true }
  )

  async function handleSubmit() {
    isSubmitting.value = true
    errorMsg.value = ''

    try {
      let parameters = {}
      try {
        parameters = JSON.parse(form.parametersStr || '{}')
      } catch {
        errorMsg.value = '参数格式错误'
        isSubmitting.value = false
        return
      }

      const { error } = await client
        .from('prompts')
        .update({
          name: form.name,
          content: form.content,
          parameters
        } as any)
        .eq('id', promptId)

      if (error) throw error
      navigateTo('/')
    } catch (e) {
      errorMsg.value = e instanceof Error ? e.message : '保存失败'
    } finally {
      isSubmitting.value = false
    }
  }
</script>
