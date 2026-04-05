/**
 * Client Evolution API — WhatsApp auto-hébergé
 * Documentation : https://doc.evolution-api.com
 */

function getBaseUrl(): string {
  return (process.env.EVOLUTION_API_URL ?? 'http://evolution:8080').replace(/\/$/, '')
}

function getGlobalKey(): string {
  return process.env.EVOLUTION_API_KEY ?? ''
}

function headers(apiKey?: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: apiKey ?? getGlobalKey(),
  }
}

// ─── Instances ────────────────────────────────────────────────────────────────

/**
 * Crée une instance WhatsApp pour un utilisateur
 */
export async function createInstance(instanceName: string): Promise<{
  instanceName: string
  apikey: string
  status: string
} | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/instance/create`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        instanceName,
        integration: 'WHATSAPP-BAILEYS',
        qrcode: true,
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      instanceName: data.instance?.instanceName ?? instanceName,
      apikey: data.hash?.apikey ?? data.hash ?? '',
      status: data.instance?.status ?? 'created',
    }
  } catch {
    return null
  }
}

/**
 * Récupère le QR code d'une instance (base64 PNG)
 */
export async function getQRCode(instanceName: string, apiKey: string): Promise<{
  qrcode: string | null
  pairingCode: string | null
  status: string
}> {
  try {
    const res = await fetch(`${getBaseUrl()}/instance/connect/${instanceName}`, {
      headers: headers(apiKey),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return { qrcode: null, pairingCode: null, status: 'error' }
    const data = await res.json()
    return {
      qrcode: data.base64 ?? null,
      pairingCode: data.pairingCode ?? null,
      status: data.instance?.state ?? 'qr',
    }
  } catch {
    return { qrcode: null, pairingCode: null, status: 'error' }
  }
}

/**
 * Vérifie l'état de connexion d'une instance
 */
export async function getConnectionState(instanceName: string, apiKey: string): Promise<{
  state: 'open' | 'connecting' | 'close' | string
  phoneNumber?: string
}> {
  try {
    const res = await fetch(`${getBaseUrl()}/instance/connectionState/${instanceName}`, {
      headers: headers(apiKey),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return { state: 'close' }
    const data = await res.json()
    return {
      state: data.instance?.state ?? data.state ?? 'close',
      phoneNumber: data.instance?.profileName ?? data.instance?.owner ?? undefined,
    }
  } catch {
    return { state: 'close' }
  }
}

/**
 * Supprime une instance (déconnexion)
 */
export async function deleteInstance(instanceName: string, apiKey: string): Promise<boolean> {
  try {
    // Déconnecter d'abord
    await fetch(`${getBaseUrl()}/instance/logout/${instanceName}`, {
      method: 'DELETE',
      headers: headers(apiKey),
      signal: AbortSignal.timeout(8000),
    })
    // Puis supprimer
    const res = await fetch(`${getBaseUrl()}/instance/delete/${instanceName}`, {
      method: 'DELETE',
      headers: headers(apiKey),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok
  } catch {
    return false
  }
}

// ─── Messages ─────────────────────────────────────────────────────────────────

/**
 * Envoie un message texte WhatsApp
 * @param instanceName - nom de l'instance Evolution
 * @param apiKey       - clé API de l'instance
 * @param phoneNumber  - numéro au format international (ex: 33612345678)
 * @param message      - texte du message
 */
export async function sendWhatsAppMessage(
  instanceName: string,
  apiKey: string,
  phoneNumber: string,
  message: string
): Promise<boolean> {
  try {
    // Nettoyage du numéro : conserver uniquement les chiffres
    const cleanNumber = phoneNumber.replace(/\D/g, '')

    const res = await fetch(`${getBaseUrl()}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({
        number: cleanNumber,
        text: message,
        options: { delay: 500 },
      }),
      signal: AbortSignal.timeout(15000),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Génère un nom d'instance unique basé sur le userId Clerk
 */
export function buildInstanceName(userId: string): string {
  // Exemple : "kc_abc12345" (court, sans caractères spéciaux)
  const suffix = userId.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toLowerCase()
  return `kc_${suffix}`
}
