// ChordPro parser and utilities

export interface ChordPosition {
  chord: string
  position: number // character index in the lyrics
}

export interface ParsedLine {
  lyrics: string
  chords: ChordPosition[]
}

export interface ParsedSection {
  name: string | null // "Verse 1", "Chorus", etc. or null for unnamed
  lines: ParsedLine[]
}

/**
 * Parse a ChordPro formatted string into structured data
 *
 * Input format:
 * [Verse 1]
 * [C]Someway, baby, it's [Am]part of me a[G]part from me.
 * [Am]You're laying [F]waste to Halloween.
 *
 * [Chorus]
 * [F]And at once I [Am]knew I was not mag[G]nificent
 */
export function parseChordPro(input: string): ParsedSection[] {
  const lines = input.split('\n')
  const sections: ParsedSection[] = []
  let currentSection: ParsedSection = { name: null, lines: [] }

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) {
      // If we have content in current section, start a new one
      if (currentSection.lines.length > 0) {
        sections.push(currentSection)
        currentSection = { name: null, lines: [] }
      }
      continue
    }

    // Check for section header like [Verse 1] or [Chorus]
    // Section headers are lines that are ONLY a bracketed word (no lyrics)
    const sectionMatch = trimmed.match(/^\[([A-Za-z0-9\s]+)\]$/)
    if (sectionMatch) {
      // Save current section if it has content
      if (currentSection.lines.length > 0 || currentSection.name) {
        sections.push(currentSection)
      }
      currentSection = { name: sectionMatch[1], lines: [] }
      continue
    }

    // Parse a line with chords
    const parsed = parseChordLine(trimmed)
    currentSection.lines.push(parsed)
  }

  // Don't forget the last section
  if (currentSection.lines.length > 0 || currentSection.name) {
    sections.push(currentSection)
  }

  return sections
}

/**
 * Parse a single line of ChordPro format
 * "[C]Someway, baby, it's [Am]part of me"
 * Returns: { lyrics: "Someway, baby, it's part of me", chords: [{chord: "C", position: 0}, {chord: "Am", position: 19}] }
 */
export function parseChordLine(line: string): ParsedLine {
  const chords: ChordPosition[] = []
  let lyrics = ''
  let i = 0

  while (i < line.length) {
    if (line[i] === '[') {
      // Find the closing bracket
      const closeIndex = line.indexOf(']', i)
      if (closeIndex !== -1) {
        const chord = line.slice(i + 1, closeIndex)
        chords.push({ chord, position: lyrics.length })
        i = closeIndex + 1
        continue
      }
    }
    lyrics += line[i]
    i++
  }

  return { lyrics, chords }
}

/**
 * Extract all unique chords from a ChordPro string
 */
export function extractChords(input: string): string[] {
  const chordRegex = /\[([A-Ga-g][#b]?(?:m|maj|min|dim|aug|sus|add)?[0-9]*(?:\/[A-Ga-g][#b]?)?)\]/g
  const matches = input.matchAll(chordRegex)
  const chords = new Set<string>()

  for (const match of matches) {
    chords.add(match[1])
  }

  return Array.from(chords)
}

/**
 * Convert simple space-separated chords to ChordPro
 * "C G Am F" -> "[C] [G] [Am] [F]"
 */
export function simpleChordsToChordPro(chords: string): string {
  return chords
    .trim()
    .split(/\s+/)
    .map(chord => `[${chord}]`)
    .join(' ')
}
