<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogOut } from '@lucide/vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const navItems = [
  { title: 'Dashboard', href: '/', icon: 'layout-dashboard' },
  { title: 'Chat', href: '/chat', icon: 'message-square' },
  { title: 'Portfolio', href: '/portfolio', icon: 'pie-chart' },
  { title: 'Watchlist', href: '/watchlist', icon: 'eye' },
  { title: 'Learn', href: '/learn', icon: 'book-open' },
] as const

const isActive = computed(() => (href: string) => route.path === href)

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <Sidebar>
    <SidebarHeader class="p-4">
      <h2 class="text-lg font-semibold tracking-tight">Ampersand</h2>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navItems" :key="item.title">
              <SidebarMenuButton as-child :is-active="isActive(item.href)">
                <a :href="item.href">
                  <!-- Icons will be replaced with Lucide when we add icon support -->
                  <span class="mr-2 text-sm">•</span>
                  <span>{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter class="p-4">
      <div v-if="auth.email" class="mb-2 truncate text-xs text-muted-foreground">
        {{ auth.email }}
      </div>
      <button
        class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        @click="handleLogout"
      >
        <LogOut class="h-4 w-4" />
        <span>Log out</span>
      </button>
    </SidebarFooter>
  </Sidebar>
</template>
