/**
 * AI API 调用组合式函数
 * 用于管理与 AI 模型的交互
 */
export function useAiApi() {
  const isProcessing = ref(false)
  const error = ref<string | null>(null)

  async function executePrompt(
    promptId: string,
    inputs: Record<string, unknown>
  ) {
    isProcessing.value = true
    error.value = null

    try {
      // TODO: 实现 AI API 调用逻辑
      const response = await $fetch('/api/ai/execute', {
        method: 'POST',
        body: { promptId, inputs }
      })
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : '执行失败'
      throw e
    } finally {
      isProcessing.value = false
    }
  }

  return {
    isProcessing,
    error,
    executePrompt
  }
}
