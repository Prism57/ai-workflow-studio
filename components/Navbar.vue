<template>
  <nav class="bg-white border-b border-border sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <div
            class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"
          >
            <svg
              width="16"
              height="16"
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span class="hidden sm:block text-foreground font-semibold"
            >AI Workflow Studio</span
          >
        </NuxtLink>

        <!-- Navigation - Desktop -->
        <div class="hidden md:flex items-center gap-1">
          <NuxtLink
            to="/"
            class="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            active-class="text-foreground bg-muted"
          >
            Prompts
          </NuxtLink>
          <NuxtLink
            to="/workflows"
            class="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            active-class="text-foreground bg-muted"
          >
            Workflows
          </NuxtLink>
        </div>

        <!-- User Menu -->
        <div class="flex items-center gap-2 sm:gap-3">
          <div v-if="user" class="flex items-center gap-2 sm:gap-3">
            <img
              :src="user.user_metadata?.avatar_url || '/default-avatar.png'"
              :alt="user.user_metadata?.name"
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border"
            />
            <span
              class="hidden lg:block text-sm text-foreground truncate max-w-[120px]"
            >
              {{ user.user_metadata?.name || user.email }}
            </span>
            <button
              @click="logout"
              class="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              退出
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation - Mobile -->
      <div class="flex md:hidden items-center gap-1 pb-2 -mx-1 overflow-x-auto">
        <NuxtLink
          to="/"
          class="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors whitespace-nowrap"
          active-class="text-foreground bg-muted"
        >
          Prompts
        </NuxtLink>
        <NuxtLink
          to="/workflows"
          class="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors whitespace-nowrap"
          active-class="text-foreground bg-muted"
        >
          Workflows
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  async function logout() {
    await client.auth.signOut()
    navigateTo('/login')
  }
</script>
