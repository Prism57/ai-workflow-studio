export default defineNuxtRouteMiddleware(to => {
  // 登录页和回调页不需要验证
  if (to.path === '/login' || to.path === '/confirm') {
    return
  }

  // API 路由不需要在这里验证
  if (to.path.startsWith('/api/')) {
    return
  }

  const user = useSupabaseUser()

  // 在客户端检查用户状态
  // 在服务端，@nuxtjs/supabase 模块会自动处理 cookie
  // 但首次 SSR 时 user 可能还没加载完成，所以只在客户端强制重定向
  if (import.meta.client && !user.value) {
    return navigateTo('/login')
  }
})
