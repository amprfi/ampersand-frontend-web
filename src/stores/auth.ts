import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Hanko } from '@teamhanko/hanko-elements'
import { config } from '@/lib/config'

/**
 * Auth store for logout and session token access.
 *
 * IMPORTANT: This store does NOT manage auth state during login. The
 * <hanko-auth> component and router guard handle the login flow:
 *   - <hanko-auth> calls register() internally and manages its own state
 *   - Router guard validates sessions via the backend (credentials: include)
 *   - @onSessionCreated on <hanko-auth> triggers the post-login redirect
 *
 * Creating a second Hanko instance during login interferes with the
 * <hanko-auth> component's internal state machine, so this store only
 * lazily creates a Hanko instance for post-login operations.
 */
export const useAuthStore = defineStore('auth', () => {
  let hanko: Hanko | null = null
  const email = ref<string | null>(null)

  // Lazy-initialise the SDK instance (only after login is complete)
  function getHanko(): Hanko {
    if (!hanko) {
      hanko = new Hanko(config.hankoApiUrl)
    }
    return hanko
  }

  async function logout() {
    try {
      await getHanko().logout()
    } catch {
      // Best-effort: clear local state regardless
    }
    email.value = null
  }

  /** Session token for use as Authorization: Bearer header in API calls */
  function getSessionToken(): string | null {
    try {
      return getHanko().getSessionToken() ?? null
    } catch {
      return null
    }
  }

  return {
    email,
    logout,
    getSessionToken,
  }
})
