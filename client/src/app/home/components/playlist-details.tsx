'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Play, Pause, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from './useMusicPlayer';

interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
}

interface PlaylistDetailsProps {
  playlist: {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
  };
  onBack: () => void;
}

export default function PlaylistDetails({ playlist, onBack }: PlaylistDetailsProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const {
    currentSong,
    playSong,
    togglePlayPause,
    isPlaying,
    setPlaylist,
  } = useMusicPlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch(`/api/getSongsByAlbum/${playlist._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setSongs(data.allSong);
      setPlaylist(data.allSong); // Set the playlist in the global context
    };
    fetchSongs();
  }, [playlist._id, setPlaylist]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0]); // Start playing the first song in the playlist
    }
  };

  return (
    <div className="min-h-screen bg-[#18181B] text-gray-200 relative">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-gray-700 rounded-full"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </Button>
        </div>

        {/* Playlist Details */}
        <div className="flex mt-8">
          <Image
            unoptimized
            src={playlist.imageUrl}
            alt={playlist.title}
            width={300}
            height={300}
            className="rounded-lg"
          />
          <div className="ml-6">
            <h1 className="text-4xl font-bold text-white">{playlist.title}</h1>
            <p className="mt-4 text-gray-400">{playlist.description}</p>
            <Button
              onClick={isPlaying ? togglePlayPause : handlePlayAll}
              className="mt-6 bg-orange-600 hover:bg-orange-500 text-white"
            >
              {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              <span>{isPlaying ? 'Pause All' : 'Play All'}</span>
            </Button>
          </div>
        </div>

        {/* Songs */}
        <div className="mt-8 bg-[#202023] p-4 rounded-lg">
          {songs?.map((song) => (
            <div
              key={song._id}
              className={`flex items-center justify-between p-2 rounded-lg hover:bg-[#2C2C2F] ${
                currentSong?._id === song._id && 'bg-[#2C2C2F]'
              }`}
            >
              <div className="flex items-center">
                <Image
                  unoptimized
                  src={song.imageUrl}
                  alt={song.title}
                  width={50}
                  height={50}
                  className="rounded"
                />
                <div className="ml-4">
                  <p className="font-semibold text-white">{song.title}</p>
                  <p className="text-gray-400 text-sm">{song.artist}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => (currentSong?._id === song._id ? togglePlayPause() : playSong(song))}
                className="text-gray-400 hover:text-white"
              >
                {currentSong?._id === song._id && isPlaying ? <Pause /> : <Play />}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
