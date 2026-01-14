export default defineNuxtRouteMiddleware(to => {
  // 登录页不需要验证
  if (to.path === '/login') {
    return
  }

  const user = useSupabaseUser()

  // 服务端直接放行，让客户端处理
  if (import.meta.server) {
    return
  }

  // 客户端检查登录状态
  if (!user.value) {
    return navigateTo('/login')
  }
})
