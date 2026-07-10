<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { sendChatMessage, type ChatMessage } from '@/lib/chat'

interface Message {
  role: 'user' | 'assistant'
  content: string
  specialistModule?: string | null
}

// Session-only message history: held in component state, not persisted.
// Reloading the page or removing the widget clears the conversation.
const messages = ref<Message[]>([])
const inputText = ref('')
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const messagesContainer = ref<HTMLElement | null>(null)

// Keep the message list pinned to the newest entry as it grows.
watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    const el = messagesContainer.value
    if (el) el.scrollTop = el.scrollHeight
  },
)

async function sendMessage() {
  const content = inputText.value.trim()
  if (!content || loading.value) return

  // Optimistically show the user's message and clear the input.
  messages.value.push({ role: 'user', content })
  inputText.value = ''
  errorMessage.value = null
  loading.value = true

  try {
    const response = await sendChatMessage(content)

    // The web channel returns the AI-generated message(s); render each.
    const reply = response.messages ?? []
    if (reply.length === 0) {
      // Acknowledged with no content — surface that gracefully.
      messages.value.push({
        role: 'assistant',
        content: 'Message received, but no response was returned.',
      })
    }
    for (const msg of reply) {
      messages.value.push(toAssistantMessage(msg))
    }
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Something went wrong'
  } finally {
    loading.value = false
  }
}

function toAssistantMessage(msg: ChatMessage): Message {
  return {
    role: 'assistant',
    content: msg.content,
    specialistModule: msg.specialist_module ?? null,
  }
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col font-mono">
    <!-- Messages -->
    <div ref="messagesContainer" class="min-h-0 flex-1 overflow-y-auto p-3">
      <!-- Empty state -->
      <div
        v-if="messages.length === 0 && !loading"
        class="flex h-full items-center justify-center px-2 text-center"
      >
        <p class="text-xs text-white/40">Ask Ampr about markets, assets, or your portfolio.</p>
      </div>

      <div
        v-for="(message, i) in messages"
        :key="i"
        class="chat-bubble mb-2 rounded-xl border border-white/10 px-3 py-2 backdrop-blur-sm"
        :class="message.role === 'user' ? 'user-bubble ml-4' : 'assistant-bubble mr-4'"
      >
        <p
          v-if="message.specialistModule"
          class="mb-1 text-[10px] uppercase tracking-wide text-white/40"
        >
          via {{ message.specialistModule }}
        </p>
        <p class="whitespace-pre-wrap text-xs leading-relaxed text-white">{{ message.content }}</p>
      </div>

      <!-- Loading indicator -->
      <div
        v-if="loading"
        class="chat-bubble assistant-bubble mr-4 mb-2 rounded-xl border border-white/10 px-3 py-2"
      >
        <p class="text-xs text-white/50">Ampr is typing…</p>
      </div>
    </div>

    <!-- Error -->
    <div v-if="errorMessage" class="border-t border-red-500/20 px-3 py-1.5">
      <p class="truncate text-xs text-red-400">{{ errorMessage }}</p>
    </div>

    <!-- Input -->
    <div class="border-t border-white/10 p-2">
      <div
        class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
      >
        <input
          v-model="inputText"
          type="text"
          placeholder="Ask anything..."
          :disabled="loading"
          class="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none disabled:opacity-50"
          @keyup.enter="sendMessage"
        />
        <button
          type="button"
          :disabled="loading || !inputText.trim()"
          class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Send message"
          @click="sendMessage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-bubble {
  background: rgba(15, 15, 30, 0.85);
}

.user-bubble {
  background: rgba(30, 40, 80, 0.9);
}
</style>
