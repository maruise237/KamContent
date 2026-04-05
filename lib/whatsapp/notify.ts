import { sendWhatsAppMessage } from './evolution'
import type { WhatsAppConfig } from '@/lib/db/schema'

/**
 * Envoie une notification WhatsApp à un utilisateur
 */
export async function sendWhatsAppNotification(
  config: WhatsAppConfig,
  phoneNumber: string,
  message: string
): Promise<boolean> {
  if (!config.instanceName) return false

  // Récupération de la clé API depuis l'env (partagée pour toutes les instances)
  const apiKey = process.env.EVOLUTION_API_KEY ?? ''

  return sendWhatsAppMessage(config.instanceName, apiKey, phoneNumber, message)
}

export function buildWhatsAppReminderMessage(
  name: string,
  topicTitle: string,
  daysSince: number
): string {
  return `Hey ${name} 👋 Tu n'as rien publié depuis ${daysSince} jours.\n\nTon prochain sujet planifié : *${topicTitle}*\nLe script est prêt. Lance-toi 🎬`
}

export function buildWhatsAppCongratsMessage(
  name: string,
  streakWeeks: number,
  consistencyScore: number
): string {
  return `🔥 *Contenu publié !* Streak : *${streakWeeks} semaine${streakWeeks > 1 ? 's' : ''}*.\nScore de constance : *${consistencyScore}%*\n\nContinue comme ça ${name} ! 💪`
}
