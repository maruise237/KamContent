/**
 * Script de migration Drizzle — à lancer via: npx tsx lib/db/migrate.ts
 */
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL non définie')
  }

  const sql = postgres(process.env.DATABASE_URL, { max: 1 })
  const db = drizzle(sql)

  console.log('▶ Lancement des migrations...')
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('✓ Migrations terminées')

  await sql.end()
}

runMigrations().catch((err) => {
  console.error('Erreur migration:', err)
  process.exit(1)
})
