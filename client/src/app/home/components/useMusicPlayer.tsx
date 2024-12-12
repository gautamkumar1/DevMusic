'use client';

import { useChatStore } from '@/store/useChatStore';
import React, { createContext, useState, useRef, useEffect, useContext, ReactNode, useCallback } from 'react';

interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
}

interface MusicPlayerContextProps {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  stopSong: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlaylist: (songs: Song[]) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => {
        playNext();
      };

      audioRef.current.addEventListener('ended', handleEnded);
      return () => {
        audioRef.current?.removeEventListener('ended', handleEnded);
      };
    }
  }, [playlist, currentIndex]);
  const socket = useChatStore.getState().socket;
  
  const playSong = (song: Song) => {
    if (audioRef.current) {
      setCurrentSong(song);
      const index = playlist.findIndex((s) => s._id === song._id);
      setCurrentIndex(index);
      audioRef.current.src = song.audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const playNext = () => {
    if (playlist.length > 0 && currentIndex >= 0) {
      const nextIndex = (currentIndex + 1) % playlist.length;
      playSong(playlist[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (playlist.length > 0 && currentIndex >= 0) {
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      playSong(playlist[prevIndex]);
    }
  };
  if(socket.auth){
    socket.emit("update_activity",{
      userId: socket.auth.userId,
      activity: isPlaying ? "Playing " + currentSong?.title + " by " + currentSong?.artist : "Idle"
    })
  }
  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        isMuted,
        playSong,
        togglePlayPause,
        stopSong,
        setVolume,
        toggleMute,
        playNext,
        playPrevious,
        setPlaylist,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
