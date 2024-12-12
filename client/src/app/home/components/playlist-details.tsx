'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Play, Pause, ChevronLeft, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
    playNext,
    playPrevious,
    setPlaylist,
    volume,
    setVolume,
    toggleMute,
    isMuted,
  } = useMusicPlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch(`http://localhost:3001/api/getSongsByAlbum/${playlist._id}`, {
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
      <div className="container mx-auto p-6 pb-24">
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
              className="mt-6 bg-green-600 hover:bg-green-500 text-white"
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

      {/* Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#202023] p-4 z-50">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Song Info with Image */}
          <div className="flex items-center">
            {currentSong && (
              <Image
                unoptimized
                src={currentSong.imageUrl}
                alt={currentSong.title}
                width={50}
                height={50}
                className="rounded mr-4"
              />
            )}
            <div>
              <p className="font-semibold text-white">{currentSong?.title || 'No song playing'}</p>
              <p className="text-sm text-gray-400">{currentSong?.artist || ''}</p>
            </div>
          </div>
          {/* Controls */}
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={playPrevious}>
              <SkipBack className="text-gray-400 w-6 h-6 hover:text-white" />
            </Button>
            <Button variant="ghost" size="icon" onClick={togglePlayPause} className="mx-4">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-gray-400 hover:text-white" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext}>
              <SkipForward className="text-gray-400 w-6 h-6 hover:text-white" />
            </Button>
          </div>
          {/* Volume */}
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? (
                <VolumeX className="text-gray-400 w-6 h-6 hover:text-white" />
              ) : (
                <Volume2 className="text-gray-400 w-6 h-6 hover:text-white" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(newVolume) => setVolume(newVolume[0])}
              className="w-24 ml-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
