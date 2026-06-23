import { createRouter, createWebHistory } from 'vue-router'
import { config } from '@/lib/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/dashboard/DashboardView.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/chat/ChatView.vue'),
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('@/views/portfolio/PortfolioView.vue'),
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: () => import('@/views/watchlist/WatchlistView.vue'),
    },
    {
      path: '/learn',
      name: 'education',
      component: () => import('@/views/education/EducationView.vue'),
    },
  ],
})

/**
 * Validate the current session by calling the backend.
 *
 * The backend's HankoAuthMiddleware reads the `hanko` cookie (set by the
 * Hanko Elements SDK) and validates it against the Hanko API. This avoids
 * creating a second Hanko client instance on the frontend that could
 * interfere with the <hanko-auth> component's state machine.
 */
async function isSessionValid(): Promise<boolean> {
  try {
    const response = await fetch(`${config.apiBaseUrl}/api/users/me`, {
      credentials: 'include',
    })
    return response.ok
  } catch {
    return false
  }
}

// Navigation guard — redirect to /login if not authenticated
router.beforeEach(async (to) => {
  // Public routes are always accessible
  if (to.meta.public) {
    return true
  }

  // Protected routes require a valid backend session
  if (!(await isSessionValid())) {
    return { name: 'login' }
  }

  return true
})

export default router
