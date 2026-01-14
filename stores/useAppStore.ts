import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态
  const isLoading = ref(false)
  const sidebarOpen = ref(true)
  const currentWorkflowId = ref<string | null>(null)

  // 计算属性
  const hasActiveWorkflow = computed(() => currentWorkflowId.value !== null)

  // 动作
  function setLoading(value: boolean) {
    isLoading.value = value
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setCurrentWorkflow(id: string | null) {
    currentWorkflowId.value = id
  }

  return {
    isLoading,
    sidebarOpen,
    currentWorkflowId,
    hasActiveWorkflow,
    setLoading,
    toggleSidebar,
    setCurrentWorkflow
  }
})
