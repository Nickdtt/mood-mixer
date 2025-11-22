import { createFileRoute } from '@tanstack/react-router'
import { generatePlaylistFn } from '../server/playlist'
import { useServerFn } from '@tanstack/react-start'
import { useState, useRef } from 'react'
import { Loader2, Music2, X, Play, Pause } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: PlaylistPage,
})

function PlaylistPage() {
  const generatePlaylist = useServerFn(generatePlaylistFn)
  const [mood, setMood] = useState('')
  const [songs, setSongs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlay = (song: any) => {
    if (playingId === song.id) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(song.preview)
      audioRef.current.volume = 0.5
      audioRef.current.play()
      audioRef.current.onended = () => setPlayingId(null)
      setPlayingId(song.id)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mood.trim()) return

    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause()
      setPlayingId(null)
    }

    setIsLoading(true)
    try {
      const result = await generatePlaylist({ data: mood })
      setSongs(result.songs)
    } catch (error) {
      console.error('Failed to generate playlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E63946] font-sans text-[#1D3557] overflow-x-hidden relative selection:bg-[#F1FAEE] selection:text-[#E63946]">
      {/* Background Noise/Texture Overlay */}
      <div className="fixed inset-0 opacity-10 pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-10 left-10 text-9xl font-black text-black opacity-5 -rotate-12 select-none pointer-events-none z-0">
        POW!
      </div>
      <div className="fixed bottom-20 right-10 text-9xl font-black text-black opacity-5 rotate-12 select-none pointer-events-none z-0">
        BAM!
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center relative">
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-[#F1FAEE] drop-shadow-[6px_6px_0px_#1D3557] transform -rotate-2">
            Mood <span className="text-[#1D3557] bg-[#F1FAEE] px-4 transform skew-x-12 inline-block border-4 border-black">Mixer</span>
          </h1>
          <div className="absolute -top-6 -right-4 md:right-20 text-[#F4A261] transform rotate-12">
            <X size={64} strokeWidth={4} />
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-[#F1FAEE] p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-1 mb-20">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="COMO SE SENTE?"
                className="w-full h-16 px-6 text-2xl font-bold border-4 border-black bg-white focus:outline-none focus:ring-4 focus:ring-[#457B9D] placeholder:text-gray-400 uppercase"
              />
              <div className="absolute -top-3 -left-3 bg-[#F4A261] px-2 py-1 border-2 border-black text-xs font-black transform -rotate-3">
                CHILL OUT
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="h-16 px-10 bg-[#1D3557] text-[#F1FAEE] text-2xl font-black uppercase border-4 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[6px_6px_0px_0px_#F4A261] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={32} /> : 'GERAR PLAYLIST'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {songs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className={`bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_#1D3557] transform transition-transform hover:scale-105 ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'} ${playingId === song.id ? 'ring-4 ring-[#F4A261]' : ''}`}
              >
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 bg-gray-200 border-2 border-black flex-shrink-0 relative overflow-hidden group">
                    {song.cover ? (
                      <img src={song.cover} alt={song.title} className={`w-full h-full object-cover transition-all ${playingId === song.id ? 'grayscale-0 scale-110' : 'grayscale group-hover:grayscale-0'}`} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#457B9D]">
                        <Music2 className="text-white" size={32} />
                      </div>
                    )}
                    {playingId === song.id && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#F4A261] rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black uppercase truncate leading-tight mb-1">{song.title}</h3>
                    <p className="text-md font-bold text-[#457B9D] truncate">{song.artist}</p>
                    <div className="mt-3 flex gap-2">
                      <span className="px-2 py-0.5 bg-[#F4A261] border-2 border-black text-xs font-bold">
                        {song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '3:45'}
                      </span>
                      <button
                        onClick={() => handlePlay(song)}
                        className={`px-3 py-1 border-2 border-black text-xs font-bold transition-colors flex items-center gap-2 ${playingId === song.id
                          ? 'bg-black text-white'
                          : 'bg-[#E63946] text-white hover:bg-black'
                          }`}
                      >
                        {playingId === song.id ? (
                          <>
                            <Pause size={12} fill="currentColor" /> PAUSE
                          </>
                        ) : (
                          <>
                            <Play size={12} fill="currentColor" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                {/* "Tape" effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#ffffff80] border border-white/50 rotate-1 backdrop-blur-sm shadow-sm"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
