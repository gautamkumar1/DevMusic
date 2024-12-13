"use client";
import { HomeIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Slider } from "./ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useMusicPlayer } from "@/app/home/components/useMusicPlayer";
import { jwtDecode } from "jwt-decode";


const LeftSidebar = () => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode<any>(token) : null;
  const router = useRouter();
  const { isLoggedIn } = useUserStore();
  const roomId = localStorage.getItem("roomId");
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
  } = useMusicPlayer();

  const handleLogout = () => {
    localStorage.removeItem("token");
    useUserStore.getState().clearState();
    toast.success("Logout successful!");
    router.push("/");
  };

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          {/* Always show Home */}
          <Link
            href="/home"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <HomeIcon className="mr-2 w-5 h-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          {/* Conditional rendering for logged-in state */}
          {isLoggedIn && (
            <>
              {/* Messages */}
              <Link
                href="/chat"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                <span className="hidden md:inline">Messages</span>
              </Link>
                            {/* Create Room */}
                            <Link
                href="/create-room"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
              >
                <span className="mr-2 w-5 h-5">🛠️</span>
                <span className="hidden md:inline">Create Room</span>
              </Link>

              {/* Live Coding */}
              <Link
                href="/create-workspace"
                
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
              >
                <span className="mr-2 w-5 h-5">🎥</span>
                <span className="hidden md:inline">Live Coding</span>
              </Link>

              {/* View Profile */}
              <Link
                href={`/profile/${decodedToken.id}`}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
              >
                <span className="mr-2 w-5 h-5">👤</span>
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
                <span className="mr-2 w-5 h-5">🚪</span>
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
      <SkipBack className="w-5 h-5 text-white" />
    </button>
    <button
      onClick={togglePlayPause}
      className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700"
    >
      {isPlaying ? (
        <Pause className="w-5 h-5 text-white" />
      ) : (
        <Play className="w-5 h-5 text-white" />
      )}
    </button>
    <button
      onClick={playNext}
      className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700"
    >
      <SkipForward className="w-5 h-5 text-white" />
    </button>
  </div>
  <div className="flex items-center space-x-2 w-full">
    <button
      onClick={toggleMute}
      className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700"
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-white" />
      ) : (
        <Volume2 className="w-5 h-5 text-white" />
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

export default LeftSidebar;
