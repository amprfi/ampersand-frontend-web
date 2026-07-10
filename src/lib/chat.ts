/**
 * Chat client for the Ampersand web chat flow.
 *
 * The backend (`POST /api/chat/message`) runs the full AI agent pipeline for
 * `channel: "web"` and returns the generated response message(s). This module
 * provides a typed wrapper over the authenticated `apiFetch` helper.
 */
import { apiFetch } from '@/composables/useApi'

/** A single chat message returned by the backend. */
export interface ChatMessage {
  content: string
  /** Optional name of the specialist module that produced this message. */
  specialist_module?: string | null
}

/** Response body for `POST /api/chat/message`. */
export interface SendMessageResponse {
  /** AI-generated message(s) for the web channel (null for the app channel). */
  messages: ChatMessage[] | null
  acknowledged: boolean
}

/** Error thrown when a chat API request fails. */
export class ChatApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ChatApiError'
  }
}

/**
 * Send a user message through the web chat channel.
 *
 * Authentication is handled by `apiFetch`, which attaches the Hanko session
 * token (read via `getSessionToken()`) as an `Authorization: Bearer` header.
 *
 * @throws {ChatApiError} if the request fails or returns a non-OK status.
 */
export async function sendChatMessage(content: string): Promise<SendMessageResponse> {
  const trimmed = content.trim()
  if (!trimmed) {
    throw new ChatApiError('Message cannot be empty', 400)
  }

  const response = await apiFetch('/api/chat/message', {
    method: 'POST',
    body: { content: trimmed, channel: 'web' },
  })

  if (!response.ok) {
    throw new ChatApiError(await extractError(response), response.status)
  }

  return (await response.json()) as SendMessageResponse
}

/** Best-effort extraction of a human-readable error detail from a Response. */
async function extractError(response: Response): Promise<string> {
  try {
    const body = await response.json()
    const detail = body?.detail
    if (typeof detail === 'string') return detail
    if (detail) return JSON.stringify(detail)
  } catch {
    // Response had no JSON body — fall through to the generic message.
  }
  return `Request failed (${response.status})`
}
