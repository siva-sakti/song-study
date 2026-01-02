export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Song Study</h1>
        <p className="text-gray-400 mb-8">Your music learning companion</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Library</h2>
            <p className="text-gray-400 text-sm">Browse and study your saved songs</p>
          </div>

          <div className="p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Add Song</h2>
            <p className="text-gray-400 text-sm">Add a new song to study</p>
          </div>

          <div className="p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Vocabulary</h2>
            <p className="text-gray-400 text-sm">Your growing music word bank</p>
          </div>

          <div className="p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Ear Training</h2>
            <p className="text-gray-400 text-sm">Practice identifying chords and progressions</p>
          </div>
        </div>

        {/* Chord color legend */}
        <div className="mt-12 p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Chord Colors</h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--chord-I)' }}></div>
              <span className="text-sm">I (home)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--chord-ii)' }}></div>
              <span className="text-sm">ii</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--chord-iii)' }}></div>
              <span className="text-sm">iii</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--chord-IV)' }}></div>
              <span className="text-sm">IV (lift)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--chord-V)' }}></div>
              <span className="text-sm">V (tension)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--chord-vi)' }}></div>
              <span className="text-sm">vi (emotional)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--chord-vii)' }}></div>
              <span className="text-sm">vii°</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
