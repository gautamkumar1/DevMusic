"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Slider } from "./ui/slider";
import { useMusicPlayer } from "@/app/user-dashboard/components/useMusicPlayer";
import { jwtDecode } from "jwt-decode";
import {IconDeviceLaptop, IconHomeBitcoin, IconLogout, IconMessageCircle, IconPlayerPause, IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward, IconTools, IconUserCircle, IconVolume2, IconVolumeOff } from "@tabler/icons-react";

const LeftSidebar = () => {
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const router = useRouter();
  const { isLoggedIn } = useUserStore();
  const [roomId, setRoomId] = useState<string | null>(null);
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    volume,
    setVolume,
    toggleMute,
    isMuted,
    currentTime,
    setCurrentTime,
    duration,
  } = useMusicPlayer();

  useEffect(() => {
    // Access localStorage only after component mounts
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storedToken) {
      setDecodedToken(jwtDecode<any>(storedToken));
    }
  }, []);

  useEffect(() => {
    // Access localStorage only after component mounts
    const storedRoomId = localStorage.getItem("roomId");
    setRoomId(storedRoomId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    useUserStore.getState().clearState();
    toast.success("Logout successful!");
    router.push("/");
  };

  const handleSliderChange = (value: number) => {
    setCurrentTime(value);
  };

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          {/* Always show Home */}
          <Link
            href="/user-dashboard"
            prefetch={true}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <IconHomeBitcoin className="mr-2 w-5 h-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          {/* Conditional rendering for logged-in state */}
          {isLoggedIn && (
            <>
              {/* Messages */}
              <Link
                href="/chat"
                prefetch={true}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
              >
                <IconMessageCircle className="mr-2 w-5 h-5" />
                <span className="hidden md:inline">Messages</span>
              </Link>
              {/* Create Room */}
              <Link
                href="/create-room"
                prefetch={true}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
              >
                 <IconTools className="mr-2 w-5 h-5" />
                 <span className="hidden md:inline">Create Room</span>
              </Link>

              {/* Live Coding */}
              <Link
                href="/create-workspace"
                prefetch={true}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
              >
                <IconDeviceLaptop className="mr-2 w-5 h-5" />
                <span className="hidden md:inline">Live Coding</span>
              </Link>

              {/* View Profile */}
              <Link
                href={`/profile/${decodedToken?.id}`}
                prefetch={true}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
              >
                 <IconUserCircle className="mr-2 w-5 h-5" />
                 <span className="hidden md:inline">View Profile</span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
              >
                <IconLogout className="mr-2 w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Audio Player */}
      <div className="flex flex-col items-center p-4 space-y-4 bg-zinc-900 rounded-lg shadow-lg">
        {currentSong ? (
          <>
            <img
              src={currentSong.imageUrl || "/placeholder.svg"}
              alt={currentSong.title}
              className="w-32 h-32 rounded-lg shadow-md"
            />
            <div className="text-center">
              <h2 className="text-lg font-bold text-white">{currentSong.title}</h2>
              <p className="text-sm text-zinc-400">{currentSong.artist}</p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-lg font-bold text-white animate-pulse">
              {"No track loaded. Start debugging your vibe!"}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Select a song to compile your coding soundtrack. 🎧
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <button
            onClick={playPrevious}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700"
          >
            <IconPlayerSkipBack className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700"
          >
            {isPlaying ? (
              <IconPlayerPause className="w-5 h-5 text-white" />
            ) : (
              <IconPlayerPlay className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            onClick={playNext}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700"
          >
            <IconPlayerSkipForward className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Song Time & Progress */}
        <div className="flex items-center space-x-2 w-full">
          <span className="text-sm text-white">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={0.1}
            onValueChange={(val) => handleSliderChange(val[0])}
            className="w-full"
          />
          <span className="text-sm text-white">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center space-x-2 w-full">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700"
          >
            {isMuted ? (
              <IconVolumeOff className="w-5 h-5 text-white" />
            ) : (
              <IconVolume2 className="w-5 h-5 text-white" />
            )}
          </button>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(val) => setVolume(val[0])}
              className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

// Helper function to format time
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default LeftSidebar;
