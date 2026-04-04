/**
 * Validation des variables d'environnement
 */

function getEnvVar(key: string, required = true): string {
  const value = process.env[key]
  if (required && !value) {
    throw new Error(`Variable d'environnement manquante : ${key}`)
  }
  return value ?? ''
}

export const env = {
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', false),
  },
  anthropic: {
    apiKey: getEnvVar('ANTHROPIC_API_KEY', false),
  },
  telegram: {
    botToken: getEnvVar('TELEGRAM_BOT_TOKEN', false),
    chatId: getEnvVar('TELEGRAM_CHAT_ID', false),
  },
  tavily: {
    apiKey: getEnvVar('TAVILY_API_KEY', false),
  },
} as const
