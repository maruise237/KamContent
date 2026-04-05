/**
 * Service de notifications Telegram
 */

const TELEGRAM_API_BASE = 'https://api.telegram.org'

export async function sendTelegramMessage(
  chatId: string,
  message: string
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN non configuré')
    return false
  }

  try {
    const response = await fetch(
      `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Erreur Telegram API:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Erreur envoi Telegram:', error)
    return false
  }
}

export function buildReminderMessage(
  name: string,
  topicTitle: string,
  daysSinceLastPublish: number
): string {
  return `Hey ${name} 👋 Tu n'as rien publié depuis ${daysSinceLastPublish} jours.

Ton prochain sujet planifié : <b>${topicTitle}</b>
Le script est prêt. Lance-toi 🎬`
}

export function buildCongratsMessage(
  name: string,
  streakWeeks: number,
  consistencyScore: number
): string {
  return `🔥 Contenu publié ! Streak : <b>${streakWeeks} semaine${streakWeeks > 1 ? 's' : ''}</b>.
Score de constance : <b>${consistencyScore}%</b>

Continue comme ça ${name} ! 💪`
}
