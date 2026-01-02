-- Song Study Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- ============================================
-- CORE TABLES
-- ============================================

-- Songs: The central entity for studying music
CREATE TABLE songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    youtube_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Song Study Details: Study metadata and analysis
CREATE TABLE song_study (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    key_note TEXT,                    -- e.g., "C", "F#", "Bb"
    key_quality TEXT,                 -- "major" or "minor"
    tempo_bpm INTEGER,
    time_signature TEXT DEFAULT '4/4',
    difficulty_level TEXT,            -- "beginner", "intermediate", "advanced"
    claude_analysis TEXT,             -- Claude's breakdown
    personal_summary TEXT,            -- Your own understanding
    study_status TEXT DEFAULT 'new',  -- "new", "learning", "comfortable", "mastered"
    UNIQUE(song_id)
);

-- ============================================
-- CHORD STRUCTURE (for visual display)
-- ============================================

-- Structured chord data for visual display and pattern analysis
CREATE TABLE song_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL,       -- "intro", "verse1", "chorus", "bridge"
    section_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE song_chords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES song_sections(id) ON DELETE CASCADE,
    chord_order INTEGER NOT NULL,
    chord_name TEXT NOT NULL,         -- e.g., "Am", "G7", "Cmaj7"
    roman_numeral TEXT,               -- "I", "IV", "V", "vi", etc.
    beats_duration INTEGER DEFAULT 4,
    lyric_snippet TEXT,               -- Lyrics sung over this chord
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LYRICS WITH SECTIONS
-- ============================================

CREATE TABLE song_lyrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES song_sections(id) ON DELETE CASCADE,
    line_order INTEGER NOT NULL,
    lyric_line TEXT NOT NULL,
    chord_above TEXT,                 -- Simple chord notation above this line
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEARNING RESOURCES
-- ============================================

CREATE TABLE song_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,      -- "tutorial", "chord_chart", "cover", "lesson"
    url TEXT NOT NULL,
    title TEXT,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MOMENTS I LOVE
-- ============================================

CREATE TABLE favorite_moments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    timestamp_seconds REAL NOT NULL,
    timestamp_end_seconds REAL,       -- Optional: for a range
    description TEXT,
    why_i_love_it TEXT,
    musical_element TEXT,             -- "chord_change", "melody", "lyrics", "harmony"
    chord_at_moment TEXT,
    emotional_tag TEXT,               -- "goosebumps", "peaceful", "energizing"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EAR TRAINING
-- ============================================

CREATE TABLE ear_training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID REFERENCES songs(id) ON DELETE SET NULL,
    session_type TEXT NOT NULL,       -- "chord_quality", "chord_progression", "interval"
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    total_attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    notes TEXT
);

CREATE TABLE ear_training_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES ear_training_sessions(id) ON DELETE CASCADE,
    prompt TEXT,
    your_guess TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    confidence_level INTEGER,         -- 1-5
    reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ear_training_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_type TEXT NOT NULL UNIQUE,  -- "major_vs_minor", "identify_V_chord"
    total_attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMPTZ,
    mastery_level TEXT DEFAULT 'learning'
);

-- ============================================
-- VOCABULARY & THEORY
-- ============================================

CREATE TABLE vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term TEXT NOT NULL UNIQUE,
    definition TEXT NOT NULL,
    category TEXT,                    -- "chord_type", "scale", "rhythm", "emotion"
    example_usage TEXT,
    learned_from_song_id UUID REFERENCES songs(id) ON DELETE SET NULL,
    confidence_level INTEGER DEFAULT 1,
    times_reviewed INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE theory_concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_name TEXT NOT NULL UNIQUE,
    simple_explanation TEXT NOT NULL,
    detailed_explanation TEXT,
    category TEXT,                    -- "scales", "chords", "harmony", "rhythm"
    example_songs TEXT,
    claude_explanation TEXT,
    mastery_level TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTES & REFLECTIONS
-- ============================================

CREATE TABLE song_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    note_type TEXT NOT NULL,          -- "reaction", "question", "insight", "goal"
    content TEXT NOT NULL,
    timestamp_seconds REAL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROGRESSION PATTERNS
-- ============================================

CREATE TABLE progression_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_name TEXT NOT NULL,
    roman_numerals TEXT NOT NULL,     -- "I-V-vi-IV"
    emotional_quality TEXT,
    genre_associations TEXT,
    examples_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE song_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    pattern_id UUID NOT NULL REFERENCES progression_patterns(id) ON DELETE CASCADE,
    section_name TEXT,
    notes TEXT,
    UNIQUE(song_id, pattern_id, section_name)
);

-- ============================================
-- CHORD FUNCTION COLORS (for visual display)
-- ============================================

CREATE TABLE chord_function_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roman_numeral TEXT NOT NULL UNIQUE,
    chord_function TEXT,
    color_hex TEXT NOT NULL,
    color_name TEXT,
    emotional_association TEXT
);

-- Pre-populate with standard colors
INSERT INTO chord_function_colors (roman_numeral, chord_function, color_hex, color_name, emotional_association) VALUES
('I', 'tonic', '#4ECDC4', 'teal', 'home, stable, resolved'),
('i', 'tonic', '#45B7AA', 'dark teal', 'home but melancholic'),
('ii', 'supertonic', '#96CEB4', 'sage', 'preparing to move'),
('II', 'supertonic', '#A8D8C4', 'light sage', 'bright preparation'),
('iii', 'mediant', '#FFEAA7', 'soft yellow', 'dreamy, floating'),
('III', 'mediant', '#FDCB6E', 'golden', 'bright surprise'),
('IV', 'subdominant', '#DDA0DD', 'plum', 'lifting, hopeful'),
('iv', 'subdominant', '#C896C8', 'dark plum', 'bittersweet longing'),
('V', 'dominant', '#FF6B6B', 'coral', 'tension, wants to resolve'),
('v', 'dominant', '#E55555', 'dark coral', 'subtle tension'),
('vi', 'submediant', '#74B9FF', 'sky blue', 'reflective, emotional'),
('VI', 'submediant', '#5DADE2', 'bright blue', 'dramatic lift'),
('vii°', 'leading tone', '#FFB347', 'orange', 'strong pull to resolve'),
('VII', 'subtonic', '#F5A623', 'amber', 'unexpected but natural');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_song_chords_section ON song_chords(section_id);
CREATE INDEX idx_song_sections_song ON song_sections(song_id);
CREATE INDEX idx_song_notes_song ON song_notes(song_id);
CREATE INDEX idx_favorite_moments_song ON favorite_moments(song_id);
CREATE INDEX idx_vocabulary_category ON vocabulary(category);
