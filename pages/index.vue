<template>
  <div>
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8"
    >
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-foreground">
          我的 Prompts
        </h1>
        <p class="text-muted-foreground text-sm mt-1">管理你的 AI 提示词模板</p>
      </div>
      <NuxtLink
        to="/prompts/new"
        class="btn-primary w-full sm:w-auto justify-center"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        新建 Prompt
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div
        class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="card p-4 border-destructive/50 bg-destructive/5 text-destructive"
    >
      {{ error.message }}
    </div>

    <!-- Empty State -->
    <div v-else-if="!prompts?.length" class="text-center py-12 sm:py-16">
      <div
        class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted mb-4"
      >
        <svg
          class="w-6 h-6 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-foreground mb-1">还没有 Prompt</h3>
      <p class="text-muted-foreground mb-6">创建你的第一个 AI 提示词模板</p>
      <NuxtLink to="/prompts/new" class="btn-primary">
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        创建 Prompt
      </NuxtLink>
    </div>

    <!-- Prompts Grid - Responsive -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
    >
      <PromptCard
        v-for="prompt in prompts"
        :key="prompt.id"
        :prompt="prompt"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const client = useSupabaseClient()

  const {
    data: prompts,
    pending,
    error,
    refresh
  } = await useAsyncData(
    'prompts',
    async () => {
      const { data, error } = await client
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    { server: false } // 只在客户端获取数据，避免 SSR 时 RLS 问题
  )

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这个 Prompt 吗？')) return

    const { error } = await client.from('prompts').delete().eq('id', id)

    if (error) {
      alert('删除失败: ' + error.message)
    } else {
      refresh()
    }
  }
</script>
