'use client'

import { parseChordPro, ParsedSection, ParsedLine } from '@/lib/chordpro'

// Color mapping for Roman numerals
const romanColors: Record<string, string> = {
  'I': '#4ECDC4',
  'i': '#45B7AA',
  'ii': '#96CEB4',
  'II': '#A8D8C4',
  'iii': '#FFEAA7',
  'III': '#FDCB6E',
  'IV': '#DDA0DD',
  'iv': '#C896C8',
  'V': '#FF6B6B',
  'v': '#E55555',
  'vi': '#74B9FF',
  'VI': '#5DADE2',
  'vii°': '#FFB347',
  'VII': '#F5A623',
}

// Map chord names to Roman numerals based on key
const chordToRoman: Record<string, Record<string, string>> = {
  'C': { 'C': 'I', 'Dm': 'ii', 'Em': 'iii', 'F': 'IV', 'G': 'V', 'Am': 'vi', 'Bdim': 'vii°', 'D': 'II', 'E': 'III', 'A': 'VI', 'B': 'VII' },
  'G': { 'G': 'I', 'Am': 'ii', 'Bm': 'iii', 'C': 'IV', 'D': 'V', 'Em': 'vi', 'F#dim': 'vii°', 'A': 'II', 'B': 'III', 'E': 'VI', 'F#': 'VII' },
  'D': { 'D': 'I', 'Em': 'ii', 'F#m': 'iii', 'G': 'IV', 'A': 'V', 'Bm': 'vi', 'C#dim': 'vii°' },
  'A': { 'A': 'I', 'Bm': 'ii', 'C#m': 'iii', 'D': 'IV', 'E': 'V', 'F#m': 'vi', 'G#dim': 'vii°' },
  'E': { 'E': 'I', 'F#m': 'ii', 'G#m': 'iii', 'A': 'IV', 'B': 'V', 'C#m': 'vi', 'D#dim': 'vii°' },
  'F': { 'F': 'I', 'Gm': 'ii', 'Am': 'iii', 'Bb': 'IV', 'C': 'V', 'Dm': 'vi', 'Edim': 'vii°' },
}

interface ChordProRendererProps {
  content: string
  keyNote?: string
  showRomanNumerals?: boolean
}

export default function ChordProRenderer({
  content,
  keyNote = 'C',
  showRomanNumerals = true
}: ChordProRendererProps) {
  const sections = parseChordPro(content)
  const romanMap = chordToRoman[keyNote] || chordToRoman['C']

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {section.name && (
            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">
              {section.name}
            </h3>
          )}
          <div className="space-y-4">
            {section.lines.map((line, lineIndex) => (
              <ChordLine
                key={lineIndex}
                line={line}
                romanMap={romanMap}
                showRomanNumerals={showRomanNumerals}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface ChordLineProps {
  line: ParsedLine
  romanMap: Record<string, string>
  showRomanNumerals: boolean
}

function ChordLine({ line, romanMap, showRomanNumerals }: ChordLineProps) {
  const { lyrics, chords } = line

  // If no lyrics, just show chord blocks in a row
  if (!lyrics.trim()) {
    return (
      <div className="flex flex-wrap gap-2">
        {chords.map((chord, i) => {
          const roman = romanMap[chord.chord] || '?'
          const color = romanColors[roman] || '#666'
          return (
            <div
              key={i}
              className="px-3 py-2 rounded-lg text-black font-semibold text-sm"
              style={{ backgroundColor: color }}
            >
              {chord.chord}
              {showRomanNumerals && (
                <span className="ml-1 opacity-70 text-xs">({roman})</span>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Build the chord line (positioned above lyrics)
  // We need to create a string with chords at the right positions
  const chordLine: React.ReactNode[] = []
  let lastEnd = 0

  for (const { chord, position } of chords) {
    const roman = romanMap[chord] || '?'
    const color = romanColors[roman] || '#666'

    // Add spacing before this chord
    if (position > lastEnd) {
      const spaces = position - lastEnd
      chordLine.push(
        <span key={`space-${position}`} className="inline-block" style={{ width: `${spaces}ch` }} />
      )
    }

    // Add the chord
    chordLine.push(
      <span
        key={`chord-${position}`}
        className="inline-block px-1 rounded text-xs font-bold"
        style={{ backgroundColor: color, color: 'black' }}
      >
        {chord}
        {showRomanNumerals && <span className="opacity-70 ml-0.5">({roman})</span>}
      </span>
    )

    lastEnd = position + chord.length + (showRomanNumerals ? roman.length + 3 : 0)
  }

  return (
    <div className="font-mono">
      {/* Chord line */}
      {chords.length > 0 && (
        <div className="text-sm mb-1 whitespace-pre">
          {chordLine}
        </div>
      )}
      {/* Lyrics line */}
      <div className="text-gray-200">{lyrics}</div>
    </div>
  )
}
