import Image from 'next/image'
import { ArrowLeft, Play } from 'lucide-react'

interface Song {
  id: number
  title: string
  artist: string
  duration: string
}

interface PlaylistDetailsProps {
  playlist: {
    id: number
    title: string
    description: string
    imageUrl: string
    songs: Song[]
  }
  onBack: () => void
}

export function PlaylistDetails({ playlist, onBack }: PlaylistDetailsProps) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-[#18181B] overflow-y-auto text-white">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-300 hover:text-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trending Playlists
        </button>
        <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
          <Image
          unoptimized
            src={playlist.imageUrl}
            alt={playlist.title}
            width={300}
            height={300}
            className="rounded-lg shadow-lg mb-4 md:mb-0 md:mr-8"
          />
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">{playlist.title}</h2>
            <p className="text-gray-400 mb-4">{playlist.description}</p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-full flex items-center">
              <Play className="mr-2 h-4 w-4" />
              Play All
            </button>
          </div>
        </div>
        <div className="bg-[#1F1F23] rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#2A2A2E]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Artist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#1F1F23] divide-y divide-gray-600">
              {playlist.songs.map((song, index) => (
                <tr key={song.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {song.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {song.artist}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {song.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
