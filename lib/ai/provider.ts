import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { mistral } from '@ai-sdk/mistral'
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModelV1 } from 'ai'

/**
 * Fournisseurs IA supportés
 *
 * Configuration via variables d'environnement :
 *   AI_PROVIDER=anthropic | openai | google | mistral | deepseek | ollama | openrouter | custom
 *   AI_MODEL=nom-du-modèle (ex: claude-sonnet-4-20250514, gpt-4o, gemini-2.0-flash)
 *
 * Pour ollama (local) :
 *   AI_PROVIDER=ollama
 *   AI_BASE_URL=http://ollama:11434/v1   (ou http://localhost:11434/v1 en dev)
 *   AI_MODEL=llama3.2 (ou tout modèle disponible dans ollama)
 *
 * Pour OpenRouter :
 *   AI_PROVIDER=openrouter
 *   AI_API_KEY=sk-or-...
 *   AI_MODEL=anthropic/claude-sonnet-4-20250514
 *
 * Pour tout fournisseur compatible OpenAI :
 *   AI_PROVIDER=custom
 *   AI_BASE_URL=https://ton-endpoint/v1
 *   AI_API_KEY=ta-clé
 *   AI_MODEL=nom-du-modèle
 */
export function getAIModel(): LanguageModelV1 {
  const provider = process.env.AI_PROVIDER ?? 'anthropic'
  const model = process.env.AI_MODEL ?? getDefaultModel(provider)

  switch (provider) {
    case 'anthropic':
      return anthropic(model)

    case 'openai':
      return openai(model)

    case 'google':
      return google(model)

    case 'mistral':
      return mistral(model)

    case 'deepseek': {
      // DeepSeek — API compatible OpenAI
      // Modèles : deepseek-chat (V3), deepseek-reasoner (R1)
      const deepseekClient = createOpenAI({
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: process.env.AI_API_KEY ?? process.env.DEEPSEEK_API_KEY ?? '',
      })
      return deepseekClient(model)
    }

    case 'ollama': {
      // Ollama est compatible OpenAI API
      const ollamaClient = createOpenAI({
        baseURL: process.env.AI_BASE_URL ?? 'http://ollama:11434/v1',
        apiKey: 'ollama', // Ollama n'a pas besoin de vraie clé
      })
      return ollamaClient(model)
    }

    case 'openrouter': {
      const openRouterClient = createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.AI_API_KEY ?? '',
        headers: {
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
          'X-Title': 'KamContent',
        },
      })
      return openRouterClient(model)
    }

    case 'custom': {
      // Tout endpoint compatible OpenAI (Groq, Together, Perplexity, etc.)
      const customClient = createOpenAI({
        baseURL: process.env.AI_BASE_URL ?? '',
        apiKey: process.env.AI_API_KEY ?? '',
      })
      return customClient(model)
    }

    default:
      throw new Error(`Fournisseur IA non supporté : ${provider}`)
  }
}

function getDefaultModel(provider: string): string {
  const defaults: Record<string, string> = {
    anthropic: 'claude-sonnet-4-20250514',
    openai: 'gpt-4o-mini',
    google: 'gemini-2.0-flash',
    mistral: 'mistral-small-latest',
    deepseek: 'deepseek-chat', // deepseek-chat (V3) ou deepseek-reasoner (R1)
    ollama: 'llama3.2',
    openrouter: 'anthropic/claude-sonnet-4-20250514',
    custom: 'gpt-4o-mini',
  }
  return defaults[provider] ?? 'gpt-4o-mini'
}
