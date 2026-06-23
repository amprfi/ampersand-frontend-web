import type { Ref } from 'vue'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { GridStack, type GridStackNode, type GridStackOptions } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'

export interface DashboardWidget {
  id: string
  type: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  static?: boolean
  props?: Record<string, unknown>
}

export function useGridStack(
  containerRef: Ref<HTMLElement | null>,
  options: GridStackOptions = {},
) {
  let grid: GridStack | null = null

  const widgets = ref<DashboardWidget[]>([])
  const isReady = ref(false)

  const defaultOptions: GridStackOptions = {
    column: 12,
    cellHeight: 70,
    margin: 8,
    float: true,
    animate: true,
    draggable: { handle: '.widget-drag-handle' },
    resizable: { handles: 'se, sw' },
    acceptWidgets: '.widget-palette-item', // Accept drops from our sidebar palette
    ...options,
  }

  onMounted(() => {
    if (!containerRef.value) return

    grid = GridStack.init(defaultOptions, containerRef.value)
    isReady.value = true

    // Listen for layout changes so we can sync our widget positions
    grid.on('change', (_event: Event, items: GridStackNode[]) => {
      items.forEach((item) => {
        const widget = widgets.value.find((w) => w.id === item.id)
        if (widget && item.el) {
          widget.x = item.x ?? widget.x
          widget.y = item.y ?? widget.y
          widget.w = item.w ?? widget.w
          widget.h = item.h ?? widget.h
        }
      })
    })

    grid.on('removed', (_event: Event, items: GridStackNode[]) => {
      items.forEach((item) => {
        const idx = widgets.value.findIndex((w) => w.id === item.id)
        if (idx !== -1) {
          widgets.value.splice(idx, 1)
        }
      })
    })
  })

  onBeforeUnmount(() => {
    grid?.destroy(false)
    grid = null
  })

  /**
   * Add a widget to the grid from the palette.
   * Called when a user drags a component from the sidebar onto the canvas,
   * or clicks "Add" in the palette.
   */
  function addWidget(widget: Omit<DashboardWidget, 'x' | 'y'>) {
    if (!grid) return

    const newWidget: DashboardWidget = {
      ...widget,
      x: 0,
      y: 0, // Gridstack will auto-place it
    }

    widgets.value.push(newWidget)

    // Add DOM element after Vue re-renders
    nextTick(() => {
      const el = containerRef.value?.querySelector(`[gs-id="${newWidget.id}"]`) as HTMLElement | null
      if (el) {
        grid!.makeWidget(el)
      }
    })
  }

  /**
   * Remove a widget from the grid.
   */
  function removeWidget(id: string) {
    if (!grid) return

    const el = containerRef.value?.querySelector(`[gs-id="${id}"]`)
    if (el) {
      grid.removeWidget(el as HTMLElement)
    }
  }

  /**
   * Serialize the current layout for persistence.
   */
  function saveLayout(): DashboardWidget[] {
    return [...widgets.value]
  }

  /**
   * Restore a previously saved layout.
   */
  function loadLayout(savedWidgets: DashboardWidget[]) {
    widgets.value = savedWidgets
  }

  return {
    grid,
    widgets,
    isReady,
    addWidget,
    removeWidget,
    saveLayout,
    loadLayout,
  }
}
