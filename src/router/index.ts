import { createRouter, createWebHistory } from 'vue-router'
import { config } from '@/lib/config'
import { useAuthStore } from '@/stores/auth'

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
 * Sends the Hanko session token as a Bearer header. The token is read via
 * `useAuthStore().getSessionToken()`, which lazily creates a Hanko instance
 * — but only on protected routes (post-login), so it never interferes with
 * the <hanko-auth> component's login state machine.
 */
async function isSessionValid(): Promise<boolean> {
  try {
    // Attach the Hanko session token as a Bearer header. The `hanko` cookie
    // is SameSite=Lax on the SPA origin, so it is NOT sent cross-site to the
    // backend — the Bearer token is what authenticates us against staging.
    const auth = useAuthStore()
    const token = auth.getSessionToken()
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${config.apiBaseUrl}/api/users/me`, {
      headers,
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
