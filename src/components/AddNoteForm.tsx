'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AddNoteFormProps {
  songId: string
}

export default function AddNoteForm({ songId }: AddNoteFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [noteType, setNoteType] = useState('reaction')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('song_notes')
        .insert({
          song_id: songId,
          note_type: noteType,
          content: content.trim(),
        })

      if (error) throw error

      setContent('')
      router.refresh()
    } catch (err) {
      console.error('Error adding note:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <select
          value={noteType}
          onChange={(e) => setNoteType(e.target.value)}
          className="p-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-teal-500 focus:outline-none"
        >
          <option value="reaction">Reaction</option>
          <option value="question">Question</option>
          <option value="insight">Insight</option>
          <option value="goal">Goal</option>
        </select>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="Add a note..."
        className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-teal-500 focus:outline-none resize-none"
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Adding...' : 'Add Note'}
      </button>
    </form>
  )
}
