import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { content, parameters } = body

  if (!content) {
    throw createError({
      statusCode: 400,
      message: '缺少 content 参数'
    })
  }

  // 获取 API 配置
  const config = useRuntimeConfig()
  const apiKey = config.glmApiKey
  const apiUrl =
    config.glmApiUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: '未配置 GLM API Key，请在 .env 中设置 GLM_API_KEY'
    })
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: parameters?.model || 'glm-4',
        messages: [{ role: 'user', content }],
        temperature: parameters?.temperature ?? 0.7,
        max_tokens: parameters?.max_tokens ?? 1000
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw createError({
        statusCode: response.status,
        message: errorData?.error?.message || `API 请求失败: ${response.status}`
      })
    }

    const data = await response.json()
    const result = data.choices?.[0]?.message?.content || ''

    return { result }
  } catch (error: any) {
    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      message: error.message || 'AI 调用失败'
    })
  }
})
