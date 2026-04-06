import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * Profils utilisateurs — clé primaire = Clerk userId
 */
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(), // Clerk userId (ex: user_2abc...)
  fullName: text('full_name'),
  telegramChatId: text('telegram_chat_id'),
  niches: text('niches').array().notNull().default([]),
  channels: text('channels').array().notNull().default([]),
  languages: text('languages').array().notNull().default([]),
  targetFrequency: integer('target_frequency').notNull().default(3),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * Sujets générés par l'IA
 */
export const topics = pgTable('topics', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  hook: text('hook').notNull(),
  angle: text('angle').notNull(),
  niche: text('niche').notNull(),
  channel: text('channel').notNull(), // tiktok | youtube | whatsapp | instagram | linkedin
  language: text('language').notNull(), // fr | en
  format: text('format').notNull(), // short | long | text
  status: text('status').notNull().default('idea'), // idea | planned | scripted | published
  selected: boolean('selected').notNull().default(false),
  weekNumber: integer('week_number'),
  scheduledDay: integer('scheduled_day'),   // 0=Lun…6=Dim (héritage)
  scheduledDate: text('scheduled_date'),    // YYYY-MM-DD — source de vérité
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * Scripts générés pour chaque sujet
 */
export const scripts = pgTable('scripts', {
  id: uuid('id').defaultRandom().primaryKey(),
  topicId: uuid('topic_id')
    .notNull()
    .references(() => topics.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  intro: text('intro').notNull(),
  points: jsonb('points').notNull().default([]),
  outro: text('outro').notNull(),
  cta: text('cta').notNull(),
  durationEstimate: integer('duration_estimate'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * Publications trackées
 */
export const publications = pgTable('publications', {
  id: uuid('id').defaultRandom().primaryKey(),
  topicId: uuid('topic_id')
    .notNull()
    .references(() => topics.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  channel: text('channel').notNull(),
  url: text('url'),
  notes: text('notes'),
})

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  topics: many(topics),
  scripts: many(scripts),
  publications: many(publications),
}))

export const topicsRelations = relations(topics, ({ one, many }) => ({
  profile: one(profiles, { fields: [topics.userId], references: [profiles.id] }),
  script: many(scripts),
  publications: many(publications),
}))

export const scriptsRelations = relations(scripts, ({ one }) => ({
  topic: one(topics, { fields: [scripts.topicId], references: [topics.id] }),
  profile: one(profiles, { fields: [scripts.userId], references: [profiles.id] }),
}))

export const publicationsRelations = relations(publications, ({ one }) => ({
  topic: one(topics, { fields: [publications.topicId], references: [topics.id] }),
  profile: one(profiles, { fields: [publications.userId], references: [profiles.id] }),
}))

/**
 * Connexions aux canaux de notification
 * channel : 'telegram' | 'whatsapp'
 * status  : 'connected' | 'disconnected' | 'pending'
 * config (telegram) : { chatId: string }
 * config (whatsapp) : { instanceName: string, phoneNumber?: string }
 */
export const channelConnections = pgTable('channel_connections', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  channel: text('channel').notNull(), // 'telegram' | 'whatsapp'
  status: text('status').notNull().default('disconnected'),
  config: jsonb('config').notNull().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const channelConnectionsRelations = relations(channelConnections, ({ one }) => ({
  profile: one(profiles, { fields: [channelConnections.userId], references: [profiles.id] }),
}))

// Types exportés
export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type Topic = typeof topics.$inferSelect
export type NewTopic = typeof topics.$inferInsert
export type Script = typeof scripts.$inferSelect
export type NewScript = typeof scripts.$inferInsert
export type Publication = typeof publications.$inferSelect
export type NewPublication = typeof publications.$inferInsert
export type ChannelConnection = typeof channelConnections.$inferSelect
export type NewChannelConnection = typeof channelConnections.$inferInsert

export interface TelegramConfig { chatId: string }
export interface WhatsAppConfig { instanceName: string; phoneNumber?: string }

export interface ScriptPoint {
  order: number
  title: string
  content: string
}
