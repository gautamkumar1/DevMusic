'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Play, Pause, ChevronLeft, Music2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@/app/user-dashboard/components/useMusicPlayer';
import { useParams, useRouter } from 'next/navigation';
import PrivateRoute from '@/components/PrivateRoute';
import MainLayout from '@/components/mainLayout/MainLayout';
import { useChatStore } from '@/store/useChatStore';
import { jwtDecode } from 'jwt-decode';

interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
}

const PlaylistDetails = () => {
  const router = useRouter();
  const { albumId } = useParams();
  const [playlistDetails, setPlaylistDetails] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [visibleSongs, setVisibleSongs] = useState<Song[]>([]);
  const chunkSize = 10; // Number of songs to load per scroll
  const { currentSong, playSong, togglePlayPause, isPlaying, setPlaylist, toggleSingleSongMode,singleSongMode } = useMusicPlayer();
  const { isConnected,initSocket} = useChatStore();
  const [token, setToken] = useState<string>("");
  const [decodedToken, setDecodedToken] = useState<any>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
    if (storedToken) {
      setDecodedToken(jwtDecode<any>(storedToken));
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (decodedToken?.id && !isConnected) {
      initSocket(decodedToken.id);
    }
  }, [initSocket, isConnected, decodedToken]);

  // Fetch playlist details and songs
  useEffect(() => {
    // console.log(`albumId ${albumId}`);
    const fetchDetailsAndSongs = async () => {
      try {
        // Fetch playlist details
        const playlistResponse = await fetch(`/api/getAlbumById/${albumId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const playlistData = await playlistResponse.json();
        setPlaylistDetails({
          title: playlistData.album.title,
          description: playlistData.album.description,
          imageUrl: playlistData.album.imageUrl,
        });

        // Fetch songs
        const songsResponse = await fetch(`/api/getSongsByAlbum/${albumId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const songsData = await songsResponse.json();
        setAllSongs(songsData.allSong || []);
        setVisibleSongs(songsData.allSong?.slice(0, chunkSize) || []);
        setPlaylist(songsData.allSong || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDetailsAndSongs();
  }, [albumId, setPlaylist]);

  // Load more songs when scrolled to the end
  const handleLoadMore = () => {
    setVisibleSongs((prev) => [
      ...prev,
      ...allSongs.slice(prev.length, prev.length + chunkSize),
    ]);
  };

  // Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    const target = document.querySelector('#scroll-end');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [visibleSongs]);
  
  const handlePlayAll = () => {
    if (allSongs.length > 0) {
      // Find the index of the current song in the playlist
      const currentIndex = allSongs.findIndex(song => song._id === currentSong?._id);
      
      // If we're at the last song or no song is playing, start from the beginning
      if (currentIndex === allSongs.length - 1 || currentIndex === -1) {
        if (singleSongMode) {
          toggleSingleSongMode(); // Disable single song mode to allow continuous play
        }
        playSong(allSongs[0]); // Start from first song
      } else {
        // If we're in the middle of the playlist, continue playing
        if (singleSongMode) {
          toggleSingleSongMode(); // Disable single song mode to allow continuous play
        }
        playSong(currentIndex >= 0 ? allSongs[currentIndex] : allSongs[0]);
      }
    }
  };
 // Add new useEffect to handle playlist completion
 useEffect(() => {
  if (currentSong && isPlaying) {
    const currentIndex = allSongs.findIndex(song => song._id === currentSong._id);
    if (currentIndex === allSongs.length - 1) {
      // If this is the last song, enable single song mode to stop after completion
      if (!singleSongMode) {
        toggleSingleSongMode();
      }
    }
  }
}, [currentSong, isPlaying, allSongs, singleSongMode, toggleSingleSongMode]);

  const handleSongPlay = (song: Song) => {
    if (currentSong?._id === song._id) {
      togglePlayPause();
    } else {
      if (!singleSongMode) {
        toggleSingleSongMode(); // Enable single song mode
      }
      playSong(song);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    const totalSeconds = allSongs.reduce((acc, song) => acc + song.duration, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours} hr ${minutes} min`;
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18181B] to-[#09090b] text-gray-200">
    <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
      {/* Header with navigation */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push('/user-dashboard')}
        className="hover:bg-gray-700/50 rounded-full"
      >
        <ChevronLeft className="w-6 h-6 text-gray-400" />
      </Button>

      {/* Hero section with playlist details */}
      <div className="flex flex-col md:flex-row items-start gap-8 my-8">
        <div className="relative group">
          <Image
            unoptimized
            src={playlistDetails.imageUrl || '/placeholder.jpg'}
            alt={playlistDetails.title || 'No Title'}
            width={300}
            height={300}
            className="rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center gap-4">
      <Button
        onClick={isPlaying ? togglePlayPause : handlePlayAll}
        className="bg-orange-600/90 hover:bg-orange-500 text-white scale-90 hover:scale-100 transition-transform duration-300"
        size="lg"
      >
        {isPlaying ? <Pause className="mr-2 h-6 w-6" /> : <Play className="mr-2 h-6 w-6" />}
        <span>{isPlaying ? 'Pause' : 'Play All'}</span>
      </Button>
      
    </div>
        </div>

        <div className="flex-1">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white tracking-tight">{playlistDetails.title}</h1>
            <p className="text-lg text-gray-400 max-w-2xl">{playlistDetails.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Music2 className="w-4 h-4" />
              <span>{allSongs.length} songs •</span>
              <span>{getTotalDuration()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Songs list with custom scrollbar */}
      <div className="flex-1 bg-[#202023]/50 rounded-xl backdrop-blur-sm overflow-hidden flex flex-col">
        {/* Headers - Fixed */}
        <div className="grid grid-cols-[auto,1fr,auto] gap-4 px-6 py-3 text-sm text-gray-400 border-b border-gray-700/50">
          <span>#</span>
          <span>TITLE</span>
          <span className="flex items-center gap-2 pr-2">
            <Clock className="w-4 h-4" />
          </span>
        </div>

        {/* Songs list with custom scrollbar */}
        <div className="flex-1 overflow-y-auto px-2 scrollbar-container">
          <style jsx global>{`
            .scrollbar-container {
              scrollbar-width: thin;
              scrollbar-color: #4B5563 transparent;
            }
            
            .scrollbar-container::-webkit-scrollbar {
              width: 6px;
            }
            
            .scrollbar-container::-webkit-scrollbar-track {
              background: transparent;
            }
            
            .scrollbar-container::-webkit-scrollbar-thumb {
              background-color: #4B5563;
              border-radius: 20px;
              border: transparent;
            }
            
            .scrollbar-container::-webkit-scrollbar-thumb:hover {
              background-color: #6B7280;
            }
          `}</style>
          
          <div className="space-y-1 py-2">
            {visibleSongs.map((song, index) => (
              <div
                key={song._id}
                className={`grid grid-cols-[auto,1fr,auto] gap-4 p-3 rounded-lg transition-colors duration-200 
                  ${currentSong?._id === song._id ? 'bg-orange-600/10' : 'hover:bg-gray-800/50'}`}
              >
                <div className="w-8 flex items-center justify-center text-gray-400">
                  {currentSong?._id === song._id ? (
                    <div className="w-4 h-4 flex items-center justify-center">
                      {isPlaying ? (
                        <span className="animate-pulse">▶</span>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Image
                    unoptimized
                    src={song.imageUrl}
                    alt={song.title}
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                  <div>
                    <p className={`font-medium ${currentSong?._id === song._id ? 'text-orange-500' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-sm text-gray-400">{song.artist}</p>
                  </div>
                </div>

                
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 w-12">
                {formatDuration(song.duration)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSongPlay(song)}
                className={`text-gray-400 hover:text-white ${
                  currentSong?._id === song._id ? 'text-orange-500' : ''
                }`}
              >
                {currentSong?._id === song._id && isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
            </div>
          
            </div>
            ))}
            
            {/* Scroll End Target */}
            <div id="scroll-end" className="h-10" />
          </div>
        </div>
      </div>
    </div>
  </div>

  );
}
const PlaylistDetailsPage = () => {
  return (
    <PrivateRoute>
      <MainLayout>
        <PlaylistDetails />
      </MainLayout>
    </PrivateRoute>
  );
};
export default PlaylistDetailsPage  ;