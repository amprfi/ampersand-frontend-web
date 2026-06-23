<script setup lang="ts">
import { WIDGET_TYPES, getWidgetType } from '@/lib/widgets'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

const emit = defineEmits<{
  add: [type: string]
}>()

// Gridstack acceptWidgets matches this class — items with it can be
// dragged directly from this palette onto the grid canvas.
// For now we also support click-to-add as a fallback.
</script>

<template>
  <div class="flex h-full w-64 flex-col border-r bg-muted/30">
    <div class="p-4">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Widgets
      </h2>
      <p class="mt-1 text-xs text-muted-foreground">
        Click to add, or drag onto your dashboard
      </p>
    </div>

    <ScrollArea class="flex-1 px-3 pb-4">
      <div class="space-y-2">
        <button
          v-for="widgetType in WIDGET_TYPES"
          :key="widgetType.type"
          class="widget-palette-item w-full rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground cursor-grab active:cursor-grabbing"
          draggable="true"
          @dragstart="(e: DragEvent) => {
            // Set the widget type as drag data so Gridstack knows what to create
            e.dataTransfer?.setData('text/plain', widgetType.type)
          }"
          @click="emit('add', widgetType.type)"
        >
          <div class="flex items-start gap-2">
            <div class="mt-0.5 flex h-5 w-5 items-center justify-center text-muted-foreground">
              <!-- Placeholder icon dot until we add Lucide -->
              <span class="text-xs">●</span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium leading-tight">{{ widgetType.label }}</p>
              <p class="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                {{ widgetType.description }}
              </p>
            </div>
          </div>
        </button>
      </div>
    </ScrollArea>
  </div>
</template>
