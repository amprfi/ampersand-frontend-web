import { ref, type Ref } from 'vue'
import { config } from '@/lib/config'
import { useAuthStore } from '@/stores/auth'

interface UseFetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: unknown
}

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<string | null>
  loading: Ref<boolean>
  execute: () => Promise<void>
}

/**
 * Composable for making authenticated API requests to the Ampersand backend.
 *
 * Sends credentials (cookies) so the backend's HankoAuthMiddleware can read
 * the `hanko` cookie. Also attaches the session token as a Bearer header
 * for cross-origin setups where cookies aren't forwarded.
 */
export function useApi<T>(path: string, options: UseFetchOptions = {}): UseFetchReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<string | null>(null)
  const loading = ref(false)

  const execute = async () => {
    loading.value = true
    error.value = null

    try {
      const auth = useAuthStore()
      const token = auth.getSessionToken()
      const authHeaders: Record<string, string> = {}
      if (token) {
        authHeaders['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${config.apiBaseUrl}${path}`, {
        method: options.method ?? 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      data.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, execute }
}

/**
 * Low-level helper for one-off authenticated requests (e.g. inside watchers).
 * Returns the raw Response so callers can handle it themselves.
 */
export async function apiFetch(
  path: string,
  options: UseFetchOptions = {},
): Promise<Response> {
  const auth = useAuthStore()
  const token = auth.getSessionToken()
  const authHeaders: Record<string, string> = {}
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`
  }

  return fetch(`${config.apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
}
