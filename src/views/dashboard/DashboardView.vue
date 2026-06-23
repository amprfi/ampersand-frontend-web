<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import { WIDGET_TYPES, getWidgetType } from '@/lib/widgets'
import WidgetTray from '@/components/dashboard/WidgetTray.vue'
import DashboardWidget from '@/components/dashboard/DashboardWidget.vue'

interface CanvasWidgetData {
  id: string
  type: string
  x: number
  y: number
  w: number
  h: number
  minW: number
  minH: number
  autoPosition?: boolean
}

const gridContainer = ref<HTMLElement | null>(null)
const canvasArea = ref<HTMLElement | null>(null)
let grid: GridStack | null = null

// All widget types start in the tray except 'chat' which starts on the canvas
const trayTypes = ref<string[]>(
  WIDGET_TYPES.filter((w) => w.type !== 'chat').map((w) => w.type),
)
const canvasWidgets = ref<CanvasWidgetData[]>([])

const GRID_COLUMNS = 12
const MAX_ROWS = 8
let widgetCounter = 0

onMounted(() => {
  if (!gridContainer.value) return

  // Calculate cell height so the grid fills the canvas area exactly
  const containerHeight = canvasArea.value?.clientHeight ?? 600
  const cellHeight = Math.max(50, Math.floor(containerHeight / MAX_ROWS))

  grid = GridStack.init(
    {
      column: GRID_COLUMNS,
      cellHeight,
      maxRow: MAX_ROWS,
      margin: 8,
      float: false,
      animate: true,
      disableOneColumnMode: true,
      draggable: { handle: '.widget-drag-handle' },
      resizable: { handles: 'se, sw' },
    },
    gridContainer.value,
  )

  // Keep widget positions in sync when GridStack moves/resizes them
  grid.on('change', (_event, items) => {
    for (const item of items) {
      const widget = canvasWidgets.value.find((w) => w.id === item.id)
      if (widget) {
        widget.x = item.x ?? widget.x
        widget.y = item.y ?? widget.y
        widget.w = item.w ?? widget.w
        widget.h = item.h ?? widget.h
      }
    }
  })

  // Place the initial chat widget on the canvas
  addWidgetToCanvas('chat')
})

onBeforeUnmount(() => {
  grid?.destroy(false)
  grid = null
})

/**
 * Figure out the next available spot in the grid that fits (w × h) cells
 * without exceeding maxRow. Returns {x, y} or null if no room.
 */
function findAvailablePosition(w: number, h: number): { x: number; y: number } | null {
  // Build an occupancy grid from current canvas widgets
  const occupied = new Set<string>()
  for (const widget of canvasWidgets.value) {
    for (let dx = 0; dx < widget.w; dx++) {
      for (let dy = 0; dy < widget.h; dy++) {
        occupied.add(`${widget.x + dx},${widget.y + dy}`)
      }
    }
  }

  // Scan top-to-bottom, left-to-right for the first fitting spot
  for (let y = 0; y <= MAX_ROWS - h; y++) {
    for (let x = 0; x <= GRID_COLUMNS - w; x++) {
      let fits = true
      for (let dx = 0; dx < w; dx++) {
        for (let dy = 0; dy < h; dy++) {
          if (occupied.has(`${x + dx},${y + dy}`)) {
            fits = false
            break
          }
        }
        if (!fits) break
      }
      if (fits) return { x, y }
    }
  }

  return null
}

function addWidgetToCanvas(type: string) {
  const widgetType = getWidgetType(type)
  if (!widgetType) return

  const id = `${type}-${++widgetCounter}`
  const isChat = type === 'chat'

  let x: number
  let y: number
  let w: number
  let h: number

  if (isChat) {
    // Chat always starts far right, full height
    x = GRID_COLUMNS - 3
    y = 0
    w = 3
    h = MAX_ROWS
  } else {
    // Try default size first, then fallback
    const sizes = [
      { w: Math.min(widgetType.defaultW, GRID_COLUMNS - 3), h: Math.min(widgetType.defaultH, MAX_ROWS) },
      { w: Math.min(widgetType.fallbackW, GRID_COLUMNS - 3), h: Math.min(widgetType.fallbackH, MAX_ROWS) },
    ]

    let spot: { x: number; y: number } | null = null
    for (const size of sizes) {
      spot = findAvailablePosition(size.w, size.h)
      if (spot) {
        w = size.w
        h = size.h
        break
      }
    }

    if (!spot) {
      // No room even at fallback size — leave in tray
      return
    }
    x = spot.x
    y = spot.y
  }

  const widget: CanvasWidgetData = {
    id,
    type,
    x,
    y,
    w,
    h,
    minW: widgetType.minW ?? 2,
    minH: widgetType.minH ?? 2,
  }

  canvasWidgets.value.push(widget)

  // Remove from tray
  const idx = trayTypes.value.indexOf(type)
  if (idx !== -1) trayTypes.value.splice(idx, 1)

  // Let Vue render the DOM element, then register it with GridStack
  nextTick(() => {
    const el = gridContainer.value?.querySelector(
      `[gs-id="${id}"]`,
    ) as HTMLElement | null
    if (el && grid) {
      grid.makeWidget(el)
    }
  })
}

function removeWidgetFromCanvas(id: string) {
  if (!grid) return

  const widget = canvasWidgets.value.find((w) => w.id === id)
  if (!widget) return

  // Remove from GridStack
  const el = gridContainer.value?.querySelector(`[gs-id="${id}"]`)
  if (el) grid.removeWidget(el as HTMLElement, false, false)

  // Return the type to the tray
  if (!trayTypes.value.includes(widget.type)) {
    trayTypes.value.push(widget.type)
  }

  canvasWidgets.value = canvasWidgets.value.filter((w) => w.id !== id)
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- GridStack canvas -->
    <div ref="canvasArea" class="canvas-bg relative flex-1 overflow-hidden p-2">
      <div ref="gridContainer" class="dashboard-grid grid-stack">
        <div
          v-for="widget in canvasWidgets"
          :key="widget.id"
          class="grid-stack-item"
          :gs-id="widget.id"
          :gs-x="widget.x"
          :gs-y="widget.y"
          :gs-w="widget.w"
          :gs-h="widget.h"
          :gs-min-w="widget.minW"
          :gs-min-h="widget.minH"
        >
          <div class="grid-stack-item-content">
            <DashboardWidget
              :type="widget.type"
              @remove="removeWidgetFromCanvas(widget.id)"
            />
          </div>
        </div>
      </div>

      <!-- Empty canvas state -->
      <div
        v-if="canvasWidgets.length === 0"
        class="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <p class="text-muted-foreground">
          Click + on a widget below to add it to the canvas
        </p>
      </div>
    </div>

    <!-- Bottom tray -->
    <WidgetTray :tray-types="trayTypes" @add="addWidgetToCanvas" />
  </div>
</template>

<style scoped>
.dashboard-grid {
  height: 100% !important;
  max-height: 100%;
  overflow: hidden;
}

.canvas-bg {
  background: radial-gradient(
    120% 160% at 50% 120%,
    #3b4fa0 0%,
    #1a1e3a 40%,
    #0e0f1a 100%
  );
}

/* Remove GridStack's drop shadow on dragged items */
:deep(.grid-stack-item.ui-draggable-dragging),
:deep(.grid-stack-item.grid-stack-placeholder) {
  box-shadow: none !important;
}
</style>
