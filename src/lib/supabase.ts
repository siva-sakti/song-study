import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Song = {
  id: string
  title: string
  artist: string
  youtube_url: string | null
  created_at: string
  updated_at: string
}

export type SongStudy = {
  id: string
  song_id: string
  key_note: string | null
  key_quality: 'major' | 'minor' | null
  tempo_bpm: number | null
  time_signature: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null
  claude_analysis: string | null
  personal_summary: string | null
  study_status: 'new' | 'learning' | 'comfortable' | 'mastered'
}

export type SongSection = {
  id: string
  song_id: string
  section_name: string
  section_order: number
}

export type SongChord = {
  id: string
  section_id: string
  chord_order: number
  chord_name: string
  roman_numeral: string | null
  beats_duration: number
  lyric_snippet: string | null
}

export type FavoriteMoment = {
  id: string
  song_id: string
  timestamp_seconds: number
  timestamp_end_seconds: number | null
  description: string | null
  why_i_love_it: string | null
  musical_element: string | null
  chord_at_moment: string | null
  emotional_tag: string | null
}

export type Vocabulary = {
  id: string
  term: string
  definition: string
  category: string | null
  example_usage: string | null
  learned_from_song_id: string | null
  confidence_level: number
  times_reviewed: number
}

export type ChordFunctionColor = {
  id: string
  roman_numeral: string
  chord_function: string | null
  color_hex: string
  color_name: string | null
  emotional_association: string | null
}
