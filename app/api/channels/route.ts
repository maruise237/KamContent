import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { channelConnections } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

// GET /api/channels — liste toutes les connexions de l'utilisateur
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const connections = await db
    .select()
    .from(channelConnections)
    .where(eq(channelConnections.userId, userId))

  return NextResponse.json({ connections })
}

// POST /api/channels — crée ou met à jour une connexion canal
// Body: { channel: 'telegram' | 'whatsapp', status: string, config: object }
export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { channel, status, config } = body as {
    channel: 'telegram' | 'whatsapp'
    status: string
    config: Record<string, unknown>
  }

  if (!channel || !status || !config) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Upsert: si une connexion existe déjà pour ce canal, on la met à jour
  const existing = await db
    .select()
    .from(channelConnections)
    .where(and(eq(channelConnections.userId, userId), eq(channelConnections.channel, channel)))
    .limit(1)

  if (existing.length > 0) {
    const [updated] = await db
      .update(channelConnections)
      .set({ status, config, updatedAt: new Date() })
      .where(and(eq(channelConnections.userId, userId), eq(channelConnections.channel, channel)))
      .returning()
    return NextResponse.json({ connection: updated })
  }

  const [created] = await db
    .insert(channelConnections)
    .values({ userId, channel, status, config })
    .returning()

  return NextResponse.json({ connection: created }, { status: 201 })
}

// DELETE /api/channels — supprime une connexion canal
// Body: { channel: 'telegram' | 'whatsapp' }
export async function DELETE(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { channel } = body as { channel: 'telegram' | 'whatsapp' }

  if (!channel) {
    return NextResponse.json({ error: 'Missing channel' }, { status: 400 })
  }

  await db
    .delete(channelConnections)
    .where(and(eq(channelConnections.userId, userId), eq(channelConnections.channel, channel)))

  return NextResponse.json({ success: true })
}
