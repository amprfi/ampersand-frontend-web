<script setup lang="ts">
import { getWidgetType } from '@/lib/widgets'
import ChatWidget from '@/components/dashboard/ChatWidget.vue'

const props = defineProps<{
  type: string
}>()

const emit = defineEmits<{
  remove: []
}>()

const widgetType = getWidgetType(props.type)
</script>

<template>
  <div
    class="widget-drag-handle flex h-full flex-col overflow-hidden rounded-lg border"
    :class="type === 'chat' ? 'glass-card border-white/10' : 'bg-card'"
  >
    <!-- Header: drag handle + title + × button -->
    <div
      class="flex items-center justify-between border-b px-3 py-1.5"
      :class="type === 'chat' ? 'border-white/10' : ''"
    >
      <span
        class="cursor-grab text-xs font-medium select-none active:cursor-grabbing"
        :class="type === 'chat' ? 'text-white/70' : 'text-muted-foreground'"
      >
        {{ widgetType?.label ?? type }}
      </span>
      <button
        class="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-destructive/10 hover:text-destructive"
        :class="type === 'chat' ? 'text-white/50' : 'text-muted-foreground'"
        title="Remove from canvas"
        @click.stop="emit('remove')"
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
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
    <!-- Content: chat gets its own component, others get placeholder -->
    <ChatWidget v-if="type === 'chat'" />
    <div v-else class="flex flex-1 items-center justify-center p-3">
      <p class="text-sm text-muted-foreground">{{ widgetType?.label ?? type }}</p>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: radial-gradient(
    96.15% 142.06% at 51.93% 100%,
    rgba(255, 255, 255, 0.6) 0%,
    rgba(255, 255, 255, 0.3) 100%
  );
  backdrop-filter: blur(20px);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 0 rgba(255, 255, 255, 0.05),
    0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>
