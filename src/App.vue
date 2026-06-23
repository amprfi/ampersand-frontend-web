<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="flex flex-1 flex-col overflow-hidden">
      <SidebarTrigger class="shrink-0" />
      <div class="min-h-0 flex-1 overflow-auto">
        <RouterView />
      </div>
    </main>
  </SidebarProvider>
</template>
