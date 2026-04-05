/**
 * Prompts système pour Claude API
 */

export function buildTopicsPrompt(
  niches: string[],
  channels: string[],
  languages: string[],
  trends: string[] = [],
  hints?: string
): string {
  const trendsContext = trends.length > 0
    ? `\n\nTendances actuelles à exploiter :\n${trends.map(t => `- ${t}`).join('\n')}`
    : ''

  const hintsContext = hints
    ? `\n\nIdées et contexte fournis par le créateur (priorité haute) :\n${hints}`
    : ''

  return `Tu es un expert en création de contenu pour les marchés francophones africains et européens.
L'utilisateur est un créateur solo dans les niches : ${niches.join(', ')}.
Ses canaux : ${channels.join(', ')}. Ses langues : ${languages.join(', ')}.${trendsContext}${hintsContext}

Génère exactement 15 sujets de contenu pour cette semaine.
Pour chaque sujet, fournis un JSON avec :
- title : titre accrocheur (max 60 caractères)
- hook : première phrase qui accroche en 1 ligne
- angle : l'angle narratif unique (ex: "contre-intuitif", "témoignage", "tuto rapide")
- niche : la niche concernée
- channel : le canal recommandé (tiktok | youtube | whatsapp)
- language : la langue recommandée (fr | en)
- format : short (<60s) | long (>3min) | text

Varie les niches, canaux et angles. Pas de répétition.
Réponds UNIQUEMENT en JSON valide, tableau de 15 objets.`
}

export function buildScriptPrompt(
  title: string,
  hook: string,
  angle: string,
  channel: string,
  format: string,
  language: string
): string {
  return `Tu es un coach en création de contenu vidéo.
Génère un script pour cette vidéo :
- Titre : ${title}
- Hook : ${hook}
- Angle : ${angle}
- Canal : ${channel} (${format})
- Langue : ${language}

Structure :
1. INTRO (15-20 secondes) : accroche directe, promesse claire
2. POINT 1 : titre + développement (2-3 phrases)
3. POINT 2 : titre + développement (2-3 phrases)
4. POINT 3 : titre + développement (2-3 phrases)
5. OUTRO : résumé en 1 phrase
6. CTA : appel à l'action adapté au canal

Ton : naturel, direct, jamais corporatif. Parle comme un humain.
Durée estimée en secondes.

Réponds UNIQUEMENT en JSON valide avec cette structure :
{
  "intro": "...",
  "points": [
    {"order": 1, "title": "...", "content": "..."},
    {"order": 2, "title": "...", "content": "..."},
    {"order": 3, "title": "...", "content": "..."}
  ],
  "outro": "...",
  "cta": "...",
  "duration_estimate": 90
}`
}

export function buildMotivationalQuotePrompt(niches: string[]): string {
  return `Tu es un coach motivationnel pour créateurs de contenu.
Génère UNE citation motivationnelle courte (max 2 phrases) pour un créateur dans les niches : ${niches.join(', ')}.
La citation doit être percutante, actionnable, et en lien direct avec la création de contenu.
Réponds UNIQUEMENT avec la citation, sans guillemets ni attribution.`
}
