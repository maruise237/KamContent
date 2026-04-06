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

interface WeeklyRecapParams {
  name: string
  weekNumber: number
  published: number
  target: number
  streak: number
  missedTopics: string[]   // titres des sujets planifiés non publiés
  nextPlanned: string[]    // titres des sujets planifiés pour la semaine prochaine
  niches: string[]
  mainChannel: string      // canal principal (tiktok | youtube | etc.)
  bestDays: string[]       // jours où l'utilisateur publie le plus (ex: ['lundi', 'jeudi'])
}

/**
 * Génère un bilan hebdomadaire ultra-personnalisé et direct.
 * Ton ajusté au palier de performance :
 *   100%+  → félicitation courte + prochain défi
 *   60-99% → encouragement + action précise manquante
 *   1-59%  → direct + critique constructive + conseils concrets
 *   0%     → sans complaisance + 1 seule action immédiate
 */
export function buildWeeklyRecapPrompt(p: WeeklyRecapParams): string {
  const ratio = p.target > 0 ? p.published / p.target : 0

  const tier =
    ratio >= 1   ? 'CHAMPION' :
    ratio >= 0.6 ? 'PARTIEL'  :
    ratio > 0    ? 'FAIBLE'   : 'ZERO'

  const toneInstruction: Record<string, string> = {
    CHAMPION: `Félicite ${p.name} chaleureusement mais brièvement. Donne 1 seul conseil pour aller encore plus loin la semaine prochaine.`,
    PARTIEL:  `Sois encourageant mais direct avec ${p.name}. Mentionne ce qui manque, nomme précisément le sujet non publié. Donne 1-2 actions concrètes.`,
    FAIBLE:   `Sois direct et critique (sans être agressif) avec ${p.name}. Identifie le problème de fond. Propose 2 actions simples et réalistes.`,
    ZERO:     `Sois sans complaisance avec ${p.name}. Pas d'excuse, pas de morale. Une seule action immédiate à faire MAINTENANT. Reformule si besoin l'objectif à la baisse.`,
  }

  const missedList = p.missedTopics.length > 0
    ? `Sujets planifiés non publiés cette semaine : ${p.missedTopics.map(t => `"${t}"`).join(', ')}`
    : 'Aucun sujet planifié manquant.'

  const nextList = p.nextPlanned.length > 0
    ? `Sujets déjà planifiés pour la semaine prochaine : ${p.nextPlanned.map(t => `"${t}"`).join(', ')}`
    : 'Aucun sujet encore planifié pour la semaine prochaine.'

  const bestDaysStr = p.bestDays.length > 0
    ? `Ses meilleurs jours de publication historiquement : ${p.bestDays.join(', ')}.`
    : ''

  return `Tu rédiges un bilan hebdomadaire WhatsApp/Telegram pour un créateur de contenu.

PROFIL :
- Nom : ${p.name}
- Semaine ${p.weekNumber}
- Niches : ${p.niches.join(', ')}
- Canal principal : ${p.mainChannel}

PERFORMANCE CETTE SEMAINE :
- Publiés : ${p.published}/${p.target}
- Streak : ${p.streak} semaine${p.streak !== 1 ? 's' : ''} consécutive${p.streak !== 1 ? 's' : ''}
- ${missedList}
- ${nextList}
- ${bestDaysStr}

NIVEAU DE PERFORMANCE : ${tier}

INSTRUCTION DE TON : ${toneInstruction[tier]}

RÈGLES DE FORMAT (impératives) :
- Maximum 7 lignes au total
- Commence par "Nom — Bilan S.XX" sur la première ligne
- Utilise des émojis sobres : ✅ ❌ ⚠️ 🔥 → (pas plus de 4 différents)
- Chiffres : toujours mentionner X/Y et le streak
- Les conseils commencent par "→"
- Pas de "Bonjour", pas de "Cordialement", pas de phrases longues
- Chaque ligne = 1 idée max
- Termine par une seule phrase d'action claire si palier < CHAMPION

Réponds UNIQUEMENT avec le message, rien d'autre.`
}

export function buildMotivationalQuotePrompt(niches: string[]): string {
  return `Tu es un coach motivationnel pour créateurs de contenu.
Génère UNE citation motivationnelle courte (max 2 phrases) pour un créateur dans les niches : ${niches.join(', ')}.
La citation doit être percutante, actionnable, et en lien direct avec la création de contenu.
Réponds UNIQUEMENT avec la citation, sans guillemets ni attribution.`
}
