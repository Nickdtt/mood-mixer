import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { generatePlaylistFn as generatePlaylistFnServer } from '../../server/playlist'
import { useState } from 'react'
import { Music, Disc3, Clock, Calendar, Sparkles } from 'lucide-react'

// Server Function - roda no servidor, chamável do cliente com type-safety
const generatePlaylistFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { mood: string }) => {
    if (!data.mood) {
      throw new Error('Mood is required')
    }
    return data
  })
  .handler(async ({ data }) => {
    try {
      const playlist = await generatePlaylistFnServer({ data: data.mood })
      return playlist
    } catch (error) {
      console.error('Error generating playlist:', error)
      throw new Error('Failed to generate playlist')
    }
  })

// Componente da rota
export const Route = createFileRoute('/api/generate-playlist')({
  component: GeneratePlaylistPage,
})

function GeneratePlaylistPage() {
  const [mood, setMood] = useState('')
  const [playlist, setPlaylist] = useState<{ songs: any[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await generatePlaylistFn({ data: { mood } })
      setPlaylist(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-green-400 font-mono">
      {/* Header com efeito terminal */}
      <div className="border-b border-green-500/30 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-bold">
              <span className="text-cyan-400">{'>'}</span> playlist_generator.exe
            </h1>
          </div>
          <p className="text-green-500/60 text-sm mt-1 ml-9">
            // AI-powered mood-based music discovery system
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="mb-8 bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 shadow-lg shadow-green-500/10">
          <label className="block text-sm mb-2 text-green-500">
            <span className="text-cyan-400">$</span> enter_mood:
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && mood && !loading) {
                  handleGenerate()
                }
              }}
              placeholder="happy, energetic, chill, nostalgic..."
              className="flex-1 bg-slate-950 border border-green-500/50 rounded px-4 py-3 text-green-400 placeholder-green-700 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !mood}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-black font-bold rounded transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚡</span> PROCESSING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> GENERATE
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold">ERROR:</span>
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Playlist Results */}
        {playlist && playlist.songs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-green-500">
              <Music className="w-5 h-5" />
              <h2 className="text-xl font-bold">
                <span className="text-cyan-400">{'>'}</span> Found {playlist.songs.length} tracks
              </h2>
            </div>

            <div className="grid gap-3">
              {playlist.songs.map((song, index) => (
                <div
                  key={song.id}
                  className="group bg-black/40 backdrop-blur-sm border border-green-500/30 hover:border-cyan-400/50 rounded-lg p-4 transition-all hover:shadow-lg hover:shadow-cyan-500/10 hover:translate-x-1"
                >
                  <div className="flex items-start gap-4">
                    {/* Track Number */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600/20 to-cyan-600/20 border border-green-500/30 rounded flex items-center justify-center text-cyan-400 font-bold group-hover:border-cyan-400/50 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-green-400 group-hover:text-cyan-400 transition-colors truncate">
                        {song.title}
                      </h3>
                      <p className="text-green-600 flex items-center gap-2 mt-1">
                        <Disc3 className="w-4 h-4" />
                        {song.artist}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-green-700">
                        {song.album && (
                          <span className="flex items-center gap-1">
                            <Music className="w-3 h-3" />
                            {song.album}
                          </span>
                        )}
                        {song.year && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {song.year}
                          </span>
                        )}
                        {song.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(song.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {playlist && playlist.songs.length === 0 && (
          <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-8 text-center">
            <p className="text-yellow-500 text-lg">
              <span className="text-yellow-400">⚠</span> No tracks found for this mood
            </p>
            <p className="text-yellow-700 text-sm mt-2">
              // Try different keywords or check if the database is populated
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
