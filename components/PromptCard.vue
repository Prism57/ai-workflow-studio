<template>
  <div class="card p-5 hover:border-zinc-300 transition-colors group">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <h3
        class="text-base font-medium text-foreground group-hover:text-primary transition-colors"
      >
        {{ prompt.name }}
      </h3>
      <div
        class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <NuxtLink
          :to="`/prompts/${prompt.id}`"
          class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          title="编辑"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </NuxtLink>
        <button
          @click="$emit('delete', prompt.id)"
          class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          title="删除"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Content Preview -->
    <p class="text-muted-foreground text-sm line-clamp-3 mb-4">
      {{ prompt.content }}
    </p>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs">
      <span class="text-muted-foreground">{{
        formatDate(prompt.created_at)
      }}</span>
      <NuxtLink
        :to="`/prompts/${prompt.id}/run`"
        class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors text-xs font-medium"
      >
        <svg
          class="w-3.5 h-3.5"
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
        执行
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Prompt } from '~/types'

  defineProps<{
    prompt: Prompt
  }>()

  defineEmits<{
    delete: [id: string]
  }>()

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
</script>
