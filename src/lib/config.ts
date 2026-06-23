// Environment configuration
// Vite exposes env vars prefixed with VITE_ via import.meta.env

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  hankoApiUrl: import.meta.env.VITE_HANKO_API_URL || 'http://localhost:8001',
} as const
