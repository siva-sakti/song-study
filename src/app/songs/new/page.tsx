'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AddSongPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    youtube_url: '',
    key_note: '',
    key_quality: 'major' as 'major' | 'minor',
    chord_progression: '', // Simple text for now, e.g., "C G Am F"
    my_reaction: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Create the song
      const { data: song, error: songError } = await supabase
        .from('songs')
        .insert({
          title: formData.title,
          artist: formData.artist,
          youtube_url: formData.youtube_url || null,
        })
        .select()
        .single()

      if (songError) throw songError

      // 2. Create the song_study entry
      const { error: studyError } = await supabase
        .from('song_study')
        .insert({
          song_id: song.id,
          key_note: formData.key_note || null,
          key_quality: formData.key_quality,
          study_status: 'new',
        })

      if (studyError) throw studyError

      // 3. If there's a chord progression, create a section and chords
      if (formData.chord_progression.trim()) {
        const { data: section, error: sectionError } = await supabase
          .from('song_sections')
          .insert({
            song_id: song.id,
            section_name: 'main',
            section_order: 0,
          })
          .select()
          .single()

        if (sectionError) throw sectionError

        // Parse chord progression (space-separated)
        const chords = formData.chord_progression.trim().split(/\s+/)
        const chordInserts = chords.map((chord, index) => ({
          section_id: section.id,
          chord_order: index,
          chord_name: chord,
        }))

        const { error: chordsError } = await supabase
          .from('song_chords')
          .insert(chordInserts)

        if (chordsError) throw chordsError
      }

      // 4. If there's a reaction, save it as a note
      if (formData.my_reaction.trim()) {
        const { error: noteError } = await supabase
          .from('song_notes')
          .insert({
            song_id: song.id,
            note_type: 'reaction',
            content: formData.my_reaction,
          })

        if (noteError) throw noteError
      }

      // Redirect to the song page
      router.push(`/songs/${song.id}`)
    } catch (err) {
      console.error('Error creating song:', err)
      setError(err instanceof Error ? err.message : 'Failed to create song')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white mb-4 inline-block">
          ← Back
        </Link>

        <h1 className="text-3xl font-bold mb-8">Add a Song to Study</h1>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Artist */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Song Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-teal-500 focus:outline-none"
                placeholder="I Am Not Magnificent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Artist *</label>
              <input
                type="text"
                required
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-teal-500 focus:outline-none"
                placeholder="Bon Iver"
              />
            </div>
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-sm font-medium mb-2">YouTube URL</label>
            <input
              type="url"
              value={formData.youtube_url}
              onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-teal-500 focus:outline-none"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          {/* Key */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Key</label>
              <select
                value={formData.key_note}
                onChange={(e) => setFormData({ ...formData, key_note: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-teal-500 focus:outline-none"
              >
                <option value="">Not sure yet</option>
                <option value="C">C</option>
                <option value="C#">C# / Db</option>
                <option value="D">D</option>
                <option value="D#">D# / Eb</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="F#">F# / Gb</option>
                <option value="G">G</option>
                <option value="G#">G# / Ab</option>
                <option value="A">A</option>
                <option value="A#">A# / Bb</option>
                <option value="B">B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quality</label>
              <select
                value={formData.key_quality}
                onChange={(e) => setFormData({ ...formData, key_quality: e.target.value as 'major' | 'minor' })}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-teal-500 focus:outline-none"
              >
                <option value="major">Major</option>
                <option value="minor">Minor</option>
              </select>
            </div>
          </div>

          {/* Chord Progression */}
          <div>
            <label className="block text-sm font-medium mb-2">Chord Progression</label>
            <input
              type="text"
              value={formData.chord_progression}
              onChange={(e) => setFormData({ ...formData, chord_progression: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-teal-500 focus:outline-none"
              placeholder="C G Am F (space-separated)"
            />
            <p className="text-gray-500 text-sm mt-1">
              Enter chords separated by spaces. You can add more detail later.
            </p>
          </div>

          {/* Initial Reaction */}
          <div>
            <label className="block text-sm font-medium mb-2">My First Reaction</label>
            <textarea
              value={formData.my_reaction}
              onChange={(e) => setFormData({ ...formData, my_reaction: e.target.value })}
              rows={3}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-teal-500 focus:outline-none resize-none"
              placeholder="What draws you to this song? How does it make you feel?"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? 'Adding...' : 'Add Song'}
          </button>
        </form>
      </div>
    </main>
  )
}
