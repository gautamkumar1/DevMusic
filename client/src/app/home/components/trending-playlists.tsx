import Image from 'next/image';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

interface Playlist {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  songs: Song[];
}

const playlists: Playlist[] = [
    {
      id: 1,
      title: "Summer Vibes",
      description: "Chill beats for sunny days",
      imageUrl: "/placeholder.svg?height=400&width=400",
      songs: [
        { id: 1, title: "Sunny Day", artist: "Beach Tunes", duration: "3:24" },
        { id: 2, title: "Ocean Breeze", artist: "Coastal Rhythms", duration: "4:12" },
        { id: 3, title: "Tropical Paradise", artist: "Island Beats", duration: "3:56" },
      ]
    },
    {
      id: 2,
      title: "Workout Mix",
      description: "High-energy tracks to pump you up",
      imageUrl: "/placeholder.svg?height=400&width=400",
      songs: [
        { id: 1, title: "Power Up", artist: "Gym Jams", duration: "3:45" },
        { id: 2, title: "Push It", artist: "Fitness Freaks", duration: "4:02" },
        { id: 3, title: "No Pain No Gain", artist: "Sweat Squad", duration: "3:38" },
      ]
    },
    {
      id: 3,
      title: "Indie Discoveries",
      description: "Fresh indie tracks you need to hear",
      imageUrl: "/placeholder.svg?height=400&width=400",
      songs: [
        { id: 1, title: "Hidden Gem", artist: "Unknown Artist", duration: "3:58" },
        { id: 2, title: "Garage Band", artist: "The Newcomers", duration: "4:15" },
        { id: 3, title: "Lo-Fi Love", artist: "Bedroom Producer", duration: "3:32" },
      ]
    },
    {
      id: 4,
      title: "Late Night Drive",
      description: "Smooth tunes for night cruising",
      imageUrl: "/placeholder.svg?height=400&width=400",
      songs: [
        { id: 1, title: "Midnight Highway", artist: "Night Rider", duration: "4:05" },
        { id: 2, title: "City Lights", artist: "Urban Echoes", duration: "3:52" },
        { id: 3, title: "Neon Dreams", artist: "Synthwave Cruisers", duration: "4:18" },
      ]
    },
    {
      id: 5,
      title: "90s Throwback",
      description: "Nostalgic hits from the 90s",
      imageUrl: "/placeholder.svg?height=400&width=400",
      songs: [
        { id: 1, title: "Retro Groove", artist: "90s Kids", duration: "3:42" },
        { id: 2, title: "Baggy Jeans", artist: "Boy Band Bros", duration: "3:56" },
        { id: 3, title: "VHS Memories", artist: "Millennium Madness", duration: "4:08" },
      ]
    },
    {
      id: 6,
      title: "Acoustic Covers",
      description: "Popular songs with an acoustic twist",
      imageUrl: "/placeholder.svg?height=400&width=400",
      songs: [
        { id: 1, title: "Unplugged Hit", artist: "Acoustic Avenue", duration: "3:37" },
        { id: 2, title: "Stripped Down", artist: "Raw Renditions", duration: "4:22" },
        { id: 3, title: "Coffee Shop Vibes", artist: "Mellow Melodies", duration: "3:49" },
      ]
    }
  ]
  
interface TrendingPlaylistsProps {
  onPlaylistSelect: (playlist: Playlist) => void;
}

export function TrendingPlaylists({ onPlaylistSelect }: TrendingPlaylistsProps) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Most Trending Playlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {playlists.map((playlist) => {
          const totalDuration = playlist.songs.reduce((acc, song) => {
            const [minutes, seconds] = song.duration.split(':').map(Number);
            return acc + minutes * 60 + seconds;
          }, 0);
          const durationFormatted = `${Math.floor(totalDuration / 60)}:${String(totalDuration % 60).padStart(2, '0')}`;
          return (
            <div
              key={playlist.id}
              className="bg-[#18181B] rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 focus:scale-105 focus:outline-none cursor-pointer"
              onClick={() => onPlaylistSelect(playlist)}
              tabIndex={0}
              role="button"
              aria-label={`Open playlist ${playlist.title}`}
            >
              <Image
                src={playlist.imageUrl}
                alt={playlist.title}
                width={400}
                height={400}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 text-white">{playlist.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{playlist.description}</p>
                <p className="text-gray-500 text-xs">
                  {playlist.songs.length} songs • {durationFormatted} minutes
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
