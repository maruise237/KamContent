# KamContent

KamContent est une plateforme SaaS de stratégie de contenu pilotée par l'IA, conçue pour aider les créateurs à maintenir leur constance sur les réseaux sociaux. Elle automatise l'idéation, la planification et le suivi des performances.

## 🚀 Fonctionnalités Clés

Le projet est articulé autour de trois modules principaux :

- **🧠 The Brain (Le Cerveau)** : Génération intelligente de sujets, d'accroches (hooks) et de scripts complets adaptés à votre niche et à vos canaux de diffusion (TikTok, YouTube, Instagram, etc.) en utilisant divers modèles d'IA.
- **📅 The Planner (Le Planificateur)** : Un calendrier éditorial interactif pour organiser vos publications de la semaine, gérer les statuts (idée, planifié, scripté, publié) et visualiser votre workflow.
- **📊 The Tracker (Le Suivi)** : Analyse de la constance avec calcul de scores de régularité, suivi des séries (streaks) et récapitulatifs hebdomadaires pour rester motivé.

## 🛠️ Stack Technique

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router)
- **Langage** : TypeScript
- **Style & UI** : Tailwind CSS, Radix UI, Lucide React, Framer Motion
- **Authentification** : [Clerk](https://clerk.com/)
- **Base de Données** : PostgreSQL (via Supabase)
- **ORM** : [Drizzle ORM](https://orm.drizzle.team/)
- **Intelligence Artificielle** : Vercel AI SDK (supporte Anthropic, OpenAI, Google Gemini, Mistral, DeepSeek)
- **Notifications & Intégrations** :
    - Telegram Bot (Notifications de rappel et félicitations)
    - WhatsApp (via Evolution API)
- **Infrastructure** : Docker & Docker Compose, SearXNG (moteur de recherche privé pour le sourcing de contenu)

## 📦 Installation et Configuration

### Prérequis

- Node.js (v18+)
- Docker et Docker Compose
- Comptes Clerk, Supabase et un fournisseur d'IA (ex: Anthropic)

### Configuration de l'environnement

Créez un fichier `.env` à la racine du projet (inspirez-vous du `docker-compose.yml` pour les variables nécessaires) :

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kamcontent

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AI Configuration
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Search (SearXNG)
SEARXNG_URL=http://localhost:8080

# Notifications
TELEGRAM_BOT_TOKEN=...
EVOLUTION_API_URL=...
EVOLUTION_API_KEY=...
```

### Lancement avec Docker

```bash
docker-compose up -d
```

### Développement Local

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Gérez la base de données :
   ```bash
   npm run db:generate  # Générer les migrations
   npm run db:push      # Pousser le schéma vers la DB
   ```

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## 🏗️ Structure du Projet

- `/app` : Routes et pages Next.js (App Router).
- `/components` : Composants React réutilisables, organisés par module (brain, planner, tracker, ui).
- `/lib` : Logique métier, clients API (AI, DB, Telegram, WhatsApp) et utilitaires.
- `/drizzle` : Fichiers de migration de la base de données.
- `/public` : Assets statiques (logos, icônes).
- `/types` : Définitions de types TypeScript partagées.

## 📝 Scripts Disponibles

- `npm run dev` : Lance l'application en mode développement.
- `npm run build` : Compile l'application pour la production.
- `npm run lint` : Vérifie la qualité du code.
- `npm run db:studio` : Ouvre l'interface de gestion de base de données Drizzle Studio.

---
Développé avec ❤️ pour les créateurs de contenu.
