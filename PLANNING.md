# Song Study - Implementation Plan & Notes

## Project Vision

A music learning companion app for someone who is:
- A **beginner** learning music theory (still learning happy vs sad chords, keys, scales)
- A **visual learner** - needs to see things, not just hear them
- Building **vocabulary** to articulate musical feelings/experiences
- Wants to **deeply study songs** over time
- Eventually wants to **write their own music** by learning patterns from songs they love

**Core philosophy:** "Copy other people → figure out what parts you like → assemble them together → do your own stuff"

---

## Core Features (Prioritized)

### 1. Song Library & Study Pages
- Add songs with YouTube link, lyrics, chords, key/scale
- Visual chord display with colored blocks by function (I=teal, IV=plum, V=coral, vi=blue)
- Lyrics aligned with chords
- Store Claude's analysis alongside personal notes

### 2. "Moments I Love" Collector
- Save specific timestamps from songs with YouTube URL + timestamp
- Tag with emotional words, what chord is playing, why it hits
- Build a collection across songs to see patterns in your taste

### 3. Vocabulary Builder
- Growing word bank for describing how music makes you feel
- Not just "happy/sad" but "aching", "suspended", "triumphant", "unsettled"
- Each term linked to songs/moments where you learned it

### 4. Ear Training Integration
- Guess chords before checking the answer
- Track guesses vs reality over time
- "Wrong" guesses are gold - they show what your ear is hearing

### 5. Pattern Recognition
- Tag songs with progression patterns (I-V-vi-IV, etc.)
- See which songs use the same tricks
- Build a library for songwriting inspiration

---

## Database Schema Summary

See `supabase/schema.sql` for full schema. Key tables:

| Table | Purpose |
|-------|---------|
| `songs` | Core song info (title, artist, youtube_url) |
| `song_study` | Key, tempo, Claude analysis, study status |
| `song_sections` | Verse, chorus, bridge sections |
| `song_chords` | Individual chords with roman numerals, lyrics |
| `song_lyrics` | Full lyrics by section |
| `favorite_moments` | Timestamped moments with emotional tags |
| `vocabulary` | Music terms and definitions |
| `ear_training_*` | Sessions, attempts, progress tracking |
| `progression_patterns` | Named patterns (I-V-vi-IV, etc.) |
| `chord_function_colors` | Color mapping for visual display |

---

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Auth:** None for now (can add later)

---

## UI/UX Notes

### Chord Color System
```
I   = #4ECDC4 (teal)      - home, stable, resolved
ii  = #96CEB4 (sage)      - preparing to move
iii = #FFEAA7 (yellow)    - dreamy, floating
IV  = #DDA0DD (plum)      - lifting, hopeful
V   = #FF6B6B (coral)     - tension, wants to resolve
vi  = #74B9FF (sky blue)  - reflective, emotional
vii = #FFB347 (orange)    - strong pull to resolve
```

### Song Entry Format (from earlier discussion)
```markdown
# Song Title
**Artist:** Name
**YouTube:** link
**Key:** C Major

## My Chord Guesses (before checking)
[User's ear training attempt]

## Actual Progression
Visual blocks showing: | I | I | vi | V | V | V | V | vi | IV | IV |

## Moments I Love
- 0:00-0:24 - description
- 1:15 - "And at once I knew" - why it hits

## My Reactions
- Free-form notes

## Claude's Analysis
- Theory breakdown
- Why it works
- Patterns to notice

## Vocabulary I'm Building
- Terms learned from this song
```

---

## Implementation Phases

### Phase 1: Core Song Study (NOW)
- [ ] Add Song form (title, artist, youtube, key, chord progression)
- [ ] Song view page with visual chord blocks
- [ ] Basic notes/reactions field
- [ ] Library page listing all songs

### Phase 2: Moments & Vocabulary
- [ ] "Moments I Love" with timestamps
- [ ] Vocabulary page with add/view
- [ ] Link vocabulary to songs

### Phase 3: Visual Enhancements
- [ ] Chord blocks with colors
- [ ] Lyrics aligned with chords
- [ ] Section labels (verse, chorus, etc.)

### Phase 4: Ear Training
- [ ] "Guess first" mode when viewing a song
- [ ] Track accuracy over time
- [ ] Progress dashboard

### Phase 5: Patterns & Songwriting
- [ ] Pattern tagging
- [ ] "Songs that use this pattern" view
- [ ] Songwriting ideas collector

---

## Example Song: "I Am Not Magnificent"

Used as reference throughout planning:

**Key:** C Major
**Progression (Intro):**
```
| C | C | Am(½) | G | G | G | G | Am | F | F | F | F |
| I | I | vi    | V | V | V | V | vi | IV| IV| IV| IV|
```

**Why it works:**
- Holds G (tension) for 4 bars - delays resolution
- Chorus starts on F (IV) not C - never get "home"
- The lack of resolution IS the feeling of the lyric

**Chord feelings:**
- I (C) = Home, stable, "we're here"
- vi (Am) = Emotional, introspective, bittersweet
- V (G) = Tension, unresolved, "waiting for something"
- IV (F) = Floating, hopeful, lifting

---

## User's Learning Context

- Has an **Omnichord** and voice (not guitar)
- Built a separate ear training app for intervals/notes
- Uses **YouTube Music** for listening
- Wants to understand WHY songs work, not just memorize
- Working on articulating feelings in general (not just music)
- Rebellious streak - wants to make their own things, not just follow rules
- But recognizes need for foundation first

---

## Resources Discussed

- **Hooktheory** (paid) - has good visual chord progressions
- **Ultimate Guitar** (free) - chord charts, accuracy varies
- **Chordify** - syncs chords to YouTube, accuracy varies

Our app differentiates by:
- Personal reactions & vocabulary (Hooktheory doesn't have)
- Ear training integration
- Claude as personalized teacher/analyst
- Free & customized to their learning style

---

## Current Status

- [x] Project initialized (Next.js + TypeScript + Tailwind)
- [x] Supabase schema created
- [x] GitHub repo connected
- [x] Basic homepage with chord color legend
- [ ] User needs to set up Supabase project and add credentials
- [ ] Add Song form
- [ ] Song view page
- [ ] Library page

---

## Next Session Checklist

1. Verify Supabase is connected
2. Build Add Song form
3. Build Song view page with chord visualization
4. Test full flow: add song → view song → see chords
