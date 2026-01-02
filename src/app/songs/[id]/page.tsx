import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ChordBlock from '@/components/ChordBlock'
import AddNoteForm from '@/components/AddNoteForm'

// Chord to Roman numeral mapping (simplified - assumes major key)
const chordToRoman: Record<string, Record<string, string>> = {
  'C': { 'C': 'I', 'Dm': 'ii', 'Em': 'iii', 'F': 'IV', 'G': 'V', 'Am': 'vi', 'Bdim': 'vii°', 'D': 'II', 'E': 'III', 'A': 'VI', 'B': 'VII' },
  'G': { 'G': 'I', 'Am': 'ii', 'Bm': 'iii', 'C': 'IV', 'D': 'V', 'Em': 'vi', 'F#dim': 'vii°' },
  'D': { 'D': 'I', 'Em': 'ii', 'F#m': 'iii', 'G': 'IV', 'A': 'V', 'Bm': 'vi', 'C#dim': 'vii°' },
  'A': { 'A': 'I', 'Bm': 'ii', 'C#m': 'iii', 'D': 'IV', 'E': 'V', 'F#m': 'vi', 'G#dim': 'vii°' },
  'E': { 'E': 'I', 'F#m': 'ii', 'G#m': 'iii', 'A': 'IV', 'B': 'V', 'C#m': 'vi', 'D#dim': 'vii°' },
  'F': { 'F': 'I', 'Gm': 'ii', 'Am': 'iii', 'Bb': 'IV', 'C': 'V', 'Dm': 'vi', 'Edim': 'vii°' },
}

async function getSong(id: string) {
  const { data: song, error } = await supabase
    .from('songs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !song) return null

  // Get study details
  const { data: study } = await supabase
    .from('song_study')
    .select('*')
    .eq('song_id', id)
    .single()

  // Get sections with chords
  const { data: sections } = await supabase
    .from('song_sections')
    .select('*, song_chords(*)')
    .eq('song_id', id)
    .order('section_order')

  // Get notes
  const { data: notes } = await supabase
    .from('song_notes')
    .select('*')
    .eq('song_id', id)
    .order('created_at', { ascending: false })

  // Get favorite moments
  const { data: moments } = await supabase
    .from('favorite_moments')
    .select('*')
    .eq('song_id', id)
    .order('timestamp_seconds')

  return { song, study, sections, notes, moments }
}

export default async function SongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getSong(id)

  if (!data) {
    notFound()
  }

  const { song, study, sections, notes, moments } = data
  const keyNote = study?.key_note || 'C'
  const keyQuality = study?.key_quality || 'major'
  const romanMap = chordToRoman[keyNote] || chordToRoman['C']

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white mb-4 inline-block">
          ← Back to Library
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{song.title}</h1>
          <p className="text-xl text-gray-400">{song.artist}</p>
          {study && (
            <div className="flex gap-4 mt-2 text-sm">
              {study.key_note && (
                <span className="px-2 py-1 bg-gray-800 rounded">
                  Key: {study.key_note} {study.key_quality}
                </span>
              )}
              <span className="px-2 py-1 bg-gray-800 rounded">
                Status: {study.study_status}
              </span>
            </div>
          )}
        </div>

        {/* YouTube Embed */}
        {song.youtube_url && (
          <div className="mb-8">
            <a
              href={song.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300"
            >
              Watch on YouTube →
            </a>
          </div>
        )}

        {/* Chord Progression - Visual Blocks */}
        {sections && sections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Chord Progression</h2>
            {sections.map((section: any) => (
              <div key={section.id} className="mb-6">
                <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                  {section.section_name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {section.song_chords
                    ?.sort((a: any, b: any) => a.chord_order - b.chord_order)
                    .map((chord: any) => {
                      const roman = chord.roman_numeral || romanMap[chord.chord_name] || '?'
                      return (
                        <ChordBlock
                          key={chord.id}
                          chordName={chord.chord_name}
                          romanNumeral={roman}
                        />
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Claude's Analysis */}
        {study?.claude_analysis && (
          <div className="mb-8 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4">Analysis</h2>
            <div className="text-gray-300 whitespace-pre-wrap">{study.claude_analysis}</div>
          </div>
        )}

        {/* My Notes */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Notes</h2>

          {notes && notes.length > 0 ? (
            <div className="space-y-4 mb-6">
              {notes.map((note: any) => (
                <div key={note.id} className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {note.note_type}
                  </span>
                  <p className="mt-1 text-gray-300">{note.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No notes yet.</p>
          )}

          <AddNoteForm songId={song.id} />
        </div>

        {/* Favorite Moments */}
        {moments && moments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Moments I Love</h2>
            <div className="space-y-4">
              {moments.map((moment: any) => (
                <div key={moment.id} className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                  <div className="flex gap-4">
                    <span className="text-teal-400 font-mono">
                      {Math.floor(moment.timestamp_seconds / 60)}:
                      {String(Math.floor(moment.timestamp_seconds % 60)).padStart(2, '0')}
                    </span>
                    <div>
                      {moment.description && <p className="text-gray-300">{moment.description}</p>}
                      {moment.why_i_love_it && (
                        <p className="text-gray-500 text-sm mt-1">{moment.why_i_love_it}</p>
                      )}
                      {moment.emotional_tag && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-800 rounded">
                          {moment.emotional_tag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
