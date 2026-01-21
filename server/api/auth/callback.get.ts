import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const code = query.code as string
  const next = (query.next as string) ?? '/'

  if (code) {
    const client = await serverSupabaseClient(event)

    // 使用授权码交换会话
    const { error } = await client.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('OAuth callback error:', error)
      return sendRedirect(
        event,
        `/login?error=${encodeURIComponent(error.message)}`
      )
    }
  }

  return sendRedirect(event, next)
})
