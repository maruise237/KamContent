/**
 * Types TypeScript pour la base de données Supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Channel = 'tiktok' | 'youtube' | 'whatsapp' | 'instagram' | 'linkedin'
export type Language = 'fr' | 'en'
export type Format = 'short' | 'long' | 'text'
export type TopicStatus = 'idea' | 'planned' | 'scripted' | 'published'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          telegram_chat_id: string | null
          niches: string[]
          channels: string[]
          languages: string[]
          target_frequency: number
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          telegram_chat_id?: string | null
          niches?: string[]
          channels?: string[]
          languages?: string[]
          target_frequency?: number
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          telegram_chat_id?: string | null
          niches?: string[]
          channels?: string[]
          languages?: string[]
          target_frequency?: number
          created_at?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          id: string
          user_id: string
          title: string
          hook: string
          angle: string
          niche: string
          channel: Channel
          language: Language
          format: Format
          status: TopicStatus
          selected: boolean
          week_number: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          hook: string
          angle: string
          niche: string
          channel: Channel
          language: Language
          format: Format
          status?: TopicStatus
          selected?: boolean
          week_number?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          hook?: string
          angle?: string
          niche?: string
          channel?: Channel
          language?: Language
          format?: Format
          status?: TopicStatus
          selected?: boolean
          week_number?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      scripts: {
        Row: {
          id: string
          topic_id: string
          user_id: string
          intro: string
          points: Json
          outro: string
          cta: string
          duration_estimate: number | null
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          user_id: string
          intro: string
          points: Json
          outro: string
          cta: string
          duration_estimate?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          user_id?: string
          intro?: string
          points?: Json
          outro?: string
          cta?: string
          duration_estimate?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripts_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "topics"
            referencedColumns: ["id"]
          }
        ]
      }
      publications: {
        Row: {
          id: string
          topic_id: string
          user_id: string
          published_at: string
          channel: Channel
          url: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          topic_id: string
          user_id: string
          published_at?: string
          channel: Channel
          url?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          topic_id?: string
          user_id?: string
          published_at?: string
          channel?: Channel
          url?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publications_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "topics"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Topic = Database['public']['Tables']['topics']['Row']
export type Script = Database['public']['Tables']['scripts']['Row']
export type Publication = Database['public']['Tables']['publications']['Row']

export interface ScriptPoint {
  order: number
  title: string
  content: string
}
