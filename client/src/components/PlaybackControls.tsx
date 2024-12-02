import { useEffect, useRef, useState } from "react";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlaybackControls = () => {
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240); // Hardcoded duration (4 minutes)
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = {
    title: "Hardcoded Song Title",
    artist: "Hardcoded Artist",
    imageUrl: "/path/to/image.jpg",
  };

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handlePlayToggle = () => {
    setIsPlaying((prev) => !prev);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        {/* Currently playing song */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          <img
            src={currentSong.imageUrl}
            alt={currentSong.title}
            className="w-14 h-14 object-cover rounded-md"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate hover:underline cursor-pointer">
              {currentSong.title}
            </div>
            <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
              {currentSong.artist}
            </div>
          </div>
        </div>

        {/* Player controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="bg-white hover:bg-white/80 text-black rounded-full h-8 w-8"
              onClick={handlePlayToggle}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-xs text-zinc-400">{formatTime(currentTime)}</div>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleSeek}
            />
            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>

        {/* Volume controls */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
            <Mic2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
            <ListMusic className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
            <Laptop2 className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
              <Volume1 className="h-4 w-4" />
            </Button>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-24 hover:cursor-grab active:cursor-grabbing"
              onValueChange={(value) => setVolume(value[0])}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlaybackControls;
