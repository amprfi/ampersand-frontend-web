<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@teamhanko/hanko-elements'
import { config } from '@/lib/config'

const router = useRouter()
const hankoError = ref<string | null>(null)

const redirectAfterLogin = () => {
  router.push('/')
}

onMounted(() => {
  register(config.hankoApiUrl).catch((e) => {
    hankoError.value = e instanceof Error ? e.message : 'Failed to load auth component'
  })
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="w-full max-w-sm space-y-6 px-4">
      <!-- Branding -->
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight">Ampersand</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Sign in or create an account
        </p>
      </div>

      <!-- Hanko auth component (login + registration combined) -->
      <div v-if="!hankoError">
        <hanko-auth @onSessionCreated="redirectAfterLogin" />
      </div>

      <!-- Error state -->
      <div v-else class="rounded-md border border-destructive bg-destructive/10 p-4 text-center">
        <p class="text-sm text-destructive">{{ hankoError }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Override Hanko container to blend with our theme */
:deep(hanko-auth) {
  --color: #ffffff;
  --primary-color: #6366f1;
  --font-family: inherit;
}
</style>
