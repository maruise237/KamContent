import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { channelConnections } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import {
  createInstance,
  getQRCode,
  getConnectionState,
  deleteInstance,
  buildInstanceName,
} from '@/lib/whatsapp/evolution'

export const dynamic = 'force-dynamic'

// POST /api/channels/whatsapp — crée l'instance et retourne le QR code
export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const instanceName = buildInstanceName(userId)

  // Créer (ou ré-utiliser) l'instance Evolution
  const instance = await createInstance(instanceName)
  if (!instance) {
    return NextResponse.json({ error: 'Impossible de créer l\'instance WhatsApp' }, { status: 502 })
  }

  // Persister dans la DB avec statut "pending"
  const existing = await db
    .select()
    .from(channelConnections)
    .where(and(eq(channelConnections.userId, userId), eq(channelConnections.channel, 'whatsapp')))
    .limit(1)

  const config = { instanceName, apikey: instance.apikey }

  if (existing.length > 0) {
    await db
      .update(channelConnections)
      .set({ status: 'pending', config, updatedAt: new Date() })
      .where(and(eq(channelConnections.userId, userId), eq(channelConnections.channel, 'whatsapp')))
  } else {
    await db
      .insert(channelConnections)
      .values({ userId, channel: 'whatsapp', status: 'pending', config })
  }

  // Récupérer le QR code
  const qrData = await getQRCode(instanceName, instance.apikey)

  return NextResponse.json({
    instanceName,
    qrcode: qrData.qrcode,
    pairingCode: qrData.pairingCode,
    status: qrData.status,
  })
}

// GET /api/channels/whatsapp — vérifie l'état de la connexion
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Récupérer la config depuis la DB
  const rows = await db
    .select()
    .from(channelConnections)
    .where(and(eq(channelConnections.userId, userId), eq(channelConnections.channel, 'whatsapp')))
    .limit(1)

  if (rows.length === 0) {
    return NextResponse.json({ status: 'disconnected' })
  }

  const connection = rows[0]
  const config = connection.config as { instanceName?: string; apikey?: string }

  if (!config.instanceName || !config.apikey) {
    return NextResponse.json({ status: 'disconnected' })
  }

  const state = await getConnectionState(config.instanceName, config.apikey)

  // Mettre à jour le statut en DB si connecté
  if (state.state === 'open' && connection.status !== 'connected') {
    const updatedConfig = {
      ...config,
      phoneNumber: state.phoneNumber,
    }
    await db
      .update(channelConnections)
      .set({ status: 'connected', config: updatedConfig, updatedAt: new Date() })
      .where(and(eq(channelConnections.userId, userId), eq(channelConnections.channel, 'whatsapp')))
  }

  return NextResponse.json({
    status: state.state === 'open' ? 'connected' : connection.status,
    phoneNumber: state.phoneNumber ?? (config as { phoneNumber?: string }).phoneNumber,
    instanceName: config.instanceName,
  })
}

// DELETE /api/channels/whatsapp — déconnecte et supprime l'instance
export async function DELETE() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db
    .select()
    .from(channelConnections)
    .where(and(eq(channelConnections.userId, userId), eq(channelConnections.channel, 'whatsapp')))
    .limit(1)

  if (rows.length > 0) {
    const config = rows[0].config as { instanceName?: string; apikey?: string }
    if (config.instanceName && config.apikey) {
      await deleteInstance(config.instanceName, config.apikey)
    }

    await db
      .delete(channelConnections)
      .where(and(eq(channelConnections.userId, userId), eq(channelConnections.channel, 'whatsapp')))
  }

  return NextResponse.json({ success: true })
}
