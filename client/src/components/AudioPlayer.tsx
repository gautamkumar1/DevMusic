"use client"

import { useEffect, useRef, useState } from "react";

interface Song {
  title: string;
  artist: string;
  audioUrl: string;
}

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  // Hardcoded songs data
  const songs: Song[] = [
    { title: "Song One", artist: "Artist One", audioUrl: "/audio/song-one.mp3" },
    { title: "Song Two", artist: "Artist Two", audioUrl: "/audio/song-two.mp3" },
    { title: "Song Three", artist: "Artist Three", audioUrl: "/audio/song-three.mp3" },
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSong = songs[currentSongIndex];

  // Play the next song
  const playNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  // Handle play/pause logic
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // Handle song ends
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      playNext();
    };

    audio?.addEventListener("ended", handleEnded);

    return () => audio?.removeEventListener("ended", handleEnded);
  }, []);

  // Handle song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    // Check if this is a new song
    const isSongChange = prevSongRef.current !== currentSong.audioUrl;
    if (isSongChange) {
      audio.src = currentSong.audioUrl;
      // Reset playback position
      audio.currentTime = 0;

      prevSongRef.current = currentSong.audioUrl;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  return (
    <div>
      <div className="player-controls">
        <h3>{currentSong.title} - {currentSong.artist}</h3>
        <button onClick={() => setIsPlaying((prev) => !prev)}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={playNext}>Next</button>
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default AudioPlayer;
