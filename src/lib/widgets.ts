/**
 * Registry of available widget types for the dashboard.
 * Each entry defines a widget the user can add to their canvas.
 */
export interface WidgetType {
  type: string
  label: string
  description: string
  defaultW: number
  defaultH: number
  fallbackW: number
  fallbackH: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  icon: string // Lucide icon name
}

export const WIDGET_TYPES: WidgetType[] = [
  {
    type: 'portfolio-summary',
    label: 'Portfolio Summary',
    description: 'Overview of your portfolio allocation and performance',
    defaultW: 4,
    defaultH: 4,
    fallbackW: 3,
    fallbackH: 3,
    minW: 3,
    minH: 3,
    icon: 'pie-chart',
  },
  {
    type: 'market-movers',
    label: 'Market Movers',
    description: 'Top gainers, losers, and most active assets',
    defaultW: 4,
    defaultH: 4,
    fallbackW: 3,
    fallbackH: 2,
    minW: 3,
    minH: 2,
    icon: 'trending-up',
  },
  {
    type: 'watchlist',
    label: 'Watchlist',
    description: 'Track your preferred assets with real-time prices',
    defaultW: 4,
    defaultH: 3,
    fallbackW: 3,
    fallbackH: 2,
    minW: 3,
    minH: 2,
    icon: 'eye',
  },
  {
    type: 'chart',
    label: 'Price Chart',
    description: 'Interactive price chart for a specific asset',
    defaultW: 6,
    defaultH: 5,
    fallbackW: 4,
    fallbackH: 3,
    minW: 4,
    minH: 3,
    icon: 'bar-chart-2',
  },
  {
    type: 'recent-alerts',
    label: 'Recent Alerts',
    description: 'Latest price and news alerts',
    defaultW: 4,
    defaultH: 3,
    fallbackW: 3,
    fallbackH: 2,
    minW: 3,
    minH: 2,
    icon: 'bell',
  },
  {
    type: 'news-feed',
    label: 'News Feed',
    description: 'Market and business news based on your preferences',
    defaultW: 4,
    defaultH: 5,
    fallbackW: 3,
    fallbackH: 3,
    minW: 3,
    minH: 3,
    icon: 'newspaper',
  },
  {
    type: 'chat',
    label: 'Ampr Chat',
    description: 'Quick chat with Ampr AI co-pilot',
    defaultW: 4,
    defaultH: 6,
    fallbackW: 3,
    fallbackH: 4,
    minW: 3,
    minH: 4,
    icon: 'message-square',
  },
  {
    type: 'portfolio-compare',
    label: 'Portfolio Compare',
    description: 'Compare hypothetical multi-asset portfolios',
    defaultW: 6,
    defaultH: 5,
    fallbackW: 4,
    fallbackH: 4,
    minW: 4,
    minH: 4,
    icon: 'git-compare',
  },
]

export function getWidgetType(type: string): WidgetType | undefined {
  return WIDGET_TYPES.find((w) => w.type === type)
}
