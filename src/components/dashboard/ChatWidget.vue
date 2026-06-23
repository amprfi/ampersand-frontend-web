<script setup lang="ts">
import { ref } from 'vue'

const inputText = ref('')

const messages = [
  {
    role: 'user' as const,
    text: "Hey, what's the current allocation of my portfolio across asset classes?",
  },
]
</script>

<template>
  <div class="flex h-full flex-col font-mono">
    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-3">
      <div
        v-for="(message, i) in messages"
        :key="i"
        class="chat-bubble mb-2 rounded-xl border border-white/10 px-3 py-2 backdrop-blur-sm"
        :class="message.role === 'user' ? 'user-bubble ml-4' : 'assistant-bubble mr-4'"
      >
        <p class="text-xs leading-relaxed text-white">{{ message.text }}</p>
      </div>
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
          class="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none"
        />
        <button
          class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
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
