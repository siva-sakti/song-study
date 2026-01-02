import { supabase } from '@/lib/supabase'
import Link from 'next/link'

async function getSongs() {
  const { data, error } = await supabase
    .from('songs')
    .select(`
      *,
      song_study (key_note, key_quality, study_status)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching songs:', error)
    return []
  }
  return data || []
}

export const revalidate = 0 // Don't cache, always fetch fresh

export default async function Home() {
  const songs = await getSongs()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Song Study</h1>
            <p className="text-gray-400">Your music learning companion</p>
          </div>
          <Link
            href="/songs/new"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg font-medium transition-colors"
          >
            + Add Song
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-800 rounded-lg text-white"
          >
            Library
          </Link>
          <Link
            href="/vocabulary"
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            Vocabulary
          </Link>
        </div>

        {/* Song List */}
        {songs.length > 0 ? (
          <div className="space-y-4">
            {songs.map((song: any) => (
              <Link
                key={song.id}
                href={`/songs/${song.id}`}
                className="block p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{song.title}</h2>
                    <p className="text-gray-400">{song.artist}</p>
                  </div>
                  <div className="flex gap-2">
                    {song.song_study?.[0]?.key_note && (
                      <span className="px-2 py-1 text-xs bg-gray-800 rounded">
                        {song.song_study[0].key_note} {song.song_study[0].key_quality}
                      </span>
                    )}
                    {song.song_study?.[0]?.study_status && (
                      <span className="px-2 py-1 text-xs bg-gray-800 rounded">
                        {song.song_study[0].study_status}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-500 mb-4">No songs yet</p>
            <Link
              href="/songs/new"
              className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg font-medium transition-colors"
            >
              Add your first song
            </Link>
          </div>
        )}

        {/* Chord Color Legend */}
        <div className="mt-12 p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Chord Colors Guide</h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#4ECDC4' }}></div>
              <span className="text-sm">I (home)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#96CEB4' }}></div>
              <span className="text-sm">ii</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#FFEAA7' }}></div>
              <span className="text-sm">iii</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#DDA0DD' }}></div>
              <span className="text-sm">IV (lift)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#FF6B6B' }}></div>
              <span className="text-sm">V (tension)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#74B9FF' }}></div>
              <span className="text-sm">vi (emotional)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#FFB347' }}></div>
              <span className="text-sm">vii°</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
