import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/**
 * Client Drizzle ORM — initialisation paresseuse (lazy) pour éviter les erreurs au build
 */
let _db: ReturnType<typeof drizzle> | null = null
let _client: ReturnType<typeof postgres> | null = null

function getDb() {
  if (_db) return _db

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL non définie. Vérifie tes variables d\'environnement.')
  }

  const max = process.env.NODE_ENV === 'production' ? 10 : 5
  _client = postgres(process.env.DATABASE_URL, { max })
  _db = drizzle(_client, { schema })
  return _db
}

/**
 * Proxy qui initialise la connexion uniquement lors du premier appel
 */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    const instance = getDb()
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop]
    if (typeof value === 'function') {
      return value.bind(instance)
    }
    return value
  },
})

export type DB = ReturnType<typeof drizzle<typeof schema>>
