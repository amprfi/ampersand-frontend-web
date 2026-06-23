// Ampersand API client
// Typed wrapper around the backend endpoints

import { config } from '@/lib/config'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Users
  async getCurrentUser() {
    return this.request('/api/users/me')
  }

  async updateUserProfile(data: Record<string, unknown>) {
    return this.request('/api/users/me/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Watchlist
  async getWatchlist() {
    return this.request('/api/watchlist')
  }

  async addToWatchlist(assetId: string) {
    return this.request('/api/watchlist', {
      method: 'POST',
      body: JSON.stringify({ assetId }),
    })
  }

  async removeFromWatchlist(assetId: string) {
    return this.request(`/api/watchlist/${assetId}`, {
      method: 'DELETE',
    })
  }

  // Chat
  async sendChatMessage(message: string) {
    return this.request('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, channel: 'web' }),
    })
  }
}

export const api = new ApiClient(config.apiBaseUrl)
