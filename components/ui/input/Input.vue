<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  const props = defineProps<{
    defaultValue?: string | number
    modelValue?: string | number
    class?: HTMLAttributes['class']
  }>()

  const emits = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const value = computed({
    get: () => props.modelValue ?? props.defaultValue ?? '',
    set: val => emits('update:modelValue', String(val))
  })
</script>

<template>
  <input
    v-model="value"
    :class="
      cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
  />
</template>
