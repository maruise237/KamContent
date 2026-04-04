-- ============================================
-- KamContent — Schéma base de données Supabase
-- ============================================

-- Profils utilisateurs (étend auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  telegram_chat_id TEXT,
  niches TEXT[] DEFAULT '{}',
  channels TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  target_frequency INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sujets générés par l'IA
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  hook TEXT NOT NULL,
  angle TEXT NOT NULL,
  niche TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('tiktok', 'youtube', 'whatsapp', 'instagram', 'linkedin')),
  language TEXT NOT NULL CHECK (language IN ('fr', 'en')),
  format TEXT NOT NULL CHECK (format IN ('short', 'long', 'text')),
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'planned', 'scripted', 'published')),
  selected BOOLEAN DEFAULT FALSE,
  week_number INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scripts générés pour chaque sujet
CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  intro TEXT NOT NULL,
  points JSONB NOT NULL DEFAULT '[]',
  outro TEXT NOT NULL,
  cta TEXT NOT NULL,
  duration_estimate INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Publications trackées
CREATE TABLE IF NOT EXISTS publications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  channel TEXT NOT NULL,
  url TEXT,
  notes TEXT
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- Policies : chaque utilisateur voit uniquement ses propres données
CREATE POLICY "Users see own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users see own topics" ON topics
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own scripts" ON scripts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own publications" ON publications
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- Trigger : création automatique du profil
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Index pour les performances
-- ============================================

CREATE INDEX IF NOT EXISTS idx_topics_user_week ON topics (user_id, week_number);
CREATE INDEX IF NOT EXISTS idx_topics_user_status ON topics (user_id, status);
CREATE INDEX IF NOT EXISTS idx_publications_user_date ON publications (user_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_scripts_topic ON scripts (topic_id);
