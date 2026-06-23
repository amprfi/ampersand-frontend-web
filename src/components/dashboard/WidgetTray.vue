<script setup lang="ts">
import { getWidgetType } from '@/lib/widgets'

defineProps<{
  trayTypes: string[]
}>()

const emit = defineEmits<{
  add: [type: string]
}>()
</script>

<template>
  <div
    class="flex h-28 shrink-0 items-center gap-3 border-t bg-muted/30 px-4 overflow-x-auto"
  >
    <TransitionGroup name="tray-item">
      <button
        v-for="type in trayTypes"
        :key="type"
        class="group relative flex h-20 w-32 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border bg-card p-2 shadow-sm transition-all hover:bg-accent hover:shadow-md"
        @click="emit('add', type)"
      >
        <!-- + button (top right, visible on hover) -->
        <span
          class="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-opacity group-hover:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </span>
        <!-- Widget label -->
        <span class="text-center text-xs font-medium leading-tight">
          {{ getWidgetType(type)?.label ?? type }}
        </span>
      </button>
    </TransitionGroup>

    <div
      v-if="trayTypes.length === 0"
      class="flex w-full items-center justify-center text-sm text-muted-foreground"
    >
      All widgets are on the canvas
    </div>
  </div>
</template>

<style scoped>
.tray-item-enter-active,
.tray-item-leave-active {
  transition: all 0.3s ease;
}
.tray-item-enter-from,
.tray-item-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
