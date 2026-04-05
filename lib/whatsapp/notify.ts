import { sendWhatsAppMessage } from './evolution'

/**
 * Envoie un message WhatsApp via l'instance globale KamContent.
 * L'instance est configurée par EVOLUTION_INSTANCE_NAME dans les env vars.
 */
export async function sendWhatsAppNotification(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  const instanceName = process.env.EVOLUTION_INSTANCE_NAME ?? ''
  const apiKey = process.env.EVOLUTION_API_KEY ?? ''

  if (!instanceName || !apiKey || !phoneNumber) return false

  return sendWhatsAppMessage(instanceName, apiKey, phoneNumber, message)
}

export function buildWhatsAppReminderMessage(
  name: string,
  topicTitle: string,
  daysSince: number
): string {
  return `Hey ${name} 👋 Tu n'as rien publié depuis ${daysSince} jours.\n\nProchain sujet : *${topicTitle}*\nLance-toi 🎬`
}

export function buildWhatsAppCongratsMessage(
  name: string,
  streakWeeks: number,
  consistencyScore: number
): string {
  return `🔥 *Publié !* Streak : *${streakWeeks} sem.*  Score : *${consistencyScore}%*\nContinue ${name} 💪`
}
