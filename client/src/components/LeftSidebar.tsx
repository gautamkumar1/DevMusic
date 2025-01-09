"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Slider } from "./ui/slider";
import { useMusicPlayer } from "@/app/user-dashboard/components/useMusicPlayer";
import { jwtDecode } from "jwt-decode";
import { IconDeviceLaptop, IconHomeBitcoin, IconLogout, IconMenu, IconMessageCircle, IconPlayerPause, IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward, IconTools, IconUserCircle, IconUsers, IconVolume2, IconVolumeOff, IconX } from "@tabler/icons-react";
import { Badge } from "./ui/badge";

const LeftSidebar = () => {
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const router = useRouter();
  const { isLoggedIn } = useUserStore();
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
  const [songCount, setSongCount] = useState<{ [key: string]: number }>({});
  const prevSongRef = useRef<string | null>(null);
  const [songPlayingEndTime, setSongPlayingEndTime] = useState<number>(0);
  const songEndLogged = useRef<boolean>(false);
  const currentSongRef = useRef<string | null>(null);
  const isProcessing = useRef<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    setIsClient(true);
    // Access localStorage only after component mounts
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storedToken) {
      setDecodedToken(jwtDecode<any>(storedToken));
    }
  }, []);
  const addSongPlayingTime = async (endTimeInMinutes: number) => {
    if (!decodedToken?.id || !currentSong?._id || isProcessing.current) {
      return;
    }

    try {
      isProcessing.current = true;
      const response = await fetch("/api/add-song-playing-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: decodedToken.id,
          songId: currentSong._id, // Add songId to track unique songs
          songPlayingTime: endTimeInMinutes
        }),
      });

      if (response.ok) {
        // console.log("Song playing time logged successfully");
        songEndLogged.current = true;
      } else {
        console.error("Failed to log song playing time");
      }
    } catch (error) {
      console.error("Error logging song playing time:", error);
    } finally {
      isProcessing.current = false;
    }
  };

  useEffect(() => {
    const handleSongEnd = async () => {
      const isSongEnded = currentTime >= duration - 0.5; // Add small buffer for end detection
      const isValidDuration = duration > 0;
      const canLogSong = !songEndLogged.current && !isProcessing.current;

      if (isSongEnded && isValidDuration && canLogSong) {
        const endTimeInMinutes = Math.floor(duration / 60);
        await addSongPlayingTime(endTimeInMinutes);
      }
    };

    // Only check for song end if the song is actually playing
    if (isPlaying) {
      handleSongEnd();
    }
  }, [currentTime, duration, isPlaying, currentSong?._id]);
  useEffect(() => {
    if (currentSong?._id !== currentSongRef.current) {
      songEndLogged.current = false;
      isProcessing.current = false;
      currentSongRef.current = currentSong?._id || null;
      setSongPlayingEndTime(0);
    }
  }, [currentSong]);

  const sendSingingActivity = async (songId: string) => {
    if (!decodedToken?.id) return;

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // yyyy-MM-dd format

    const count = songCount[songId] || 1; // Default to 1 if not yet set

    try {
      const response = await fetch("/api/singing-activity-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },


        body: JSON.stringify({
          userId: decodedToken.id,
          date: formattedDate,
          count,
        }),
      });
      const responseData = await response.json();
      // console.log(`Response>>>>> ${responseData}`);
    } catch (error) {
      console.error("Error logging singing activity:", error);
    }
  };
  useEffect(() => {
    if (currentSong?._id && prevSongRef.current !== currentSong._id) {
      // Update the count for the current song
      setSongCount((prev) => ({
        ...prev,
        [currentSong._id]: (prev[currentSong._id] || 0) + 1,
      }));

      // Log the activity
      sendSingingActivity(currentSong._id);

      // Update the previous song reference
      prevSongRef.current = currentSong._id;
    }
  }, [currentSong]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    useUserStore.getState().clearState();
    toast.success("Logout successful!");
    router.push("/");
  };

  const handleSliderChange = (value: number) => {
    setCurrentTime(value);
  };
  const sidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isClient) {
    return null; // Return null on server-side to prevent hydration mismatch
  }
  return (
    <>
     <div className="h-screen lg:h-auto">
      {/* Mobile Menu Toggle - Fixed Position */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-800 lg:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <IconX className="w-6 h-6 text-white" />
        ) : (
          <IconMenu className="w-6 h-6 text-white" />
        )}
      </button>
     <div>
     
     </div>
      {/* Sidebar Wrapper */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed lg:relative inset-y-0 left-0 w-64 bg-zinc-950",
          "transform transition-transform duration-300 ease-in-out",
          "lg:transform-none lg:translate-x-0",
          "z-40 overflow-hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Scrollable Content Container */}
        <div className="h-full flex flex-col gap-2 p-4 overflow-y-auto">
          {/* Navigation Menu */}
          <nav className="rounded-lg bg-zinc-900 p-4">
            <div className="space-y-2">
              <Link
                href="/user-dashboard"
                prefetch={true}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "w-full justify-start text-white hover:bg-zinc-800",
                  })
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IconHomeBitcoin className="mr-2 w-5 h-5" />
                <span>Home</span>
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    href="/chat"
                    prefetch={true}
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        className: "w-full justify-start text-white hover:bg-zinc-800",
                      })
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconMessageCircle className="mr-2 w-5 h-5" />
                    <span>Messages</span>
                  </Link>

                  <Link
                    href="#"
                    prefetch={true}
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        className: "w-full justify-start text-white hover:bg-zinc-800 relative"
                      })
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconTools className="mr-2 w-5 h-5" />
                    <span>Create Room</span>
                  </Link>

                  <Link
                    href="/create-workspace"
                    prefetch={true}
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        className: "w-full justify-start text-white hover:bg-zinc-800",
                      })
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconDeviceLaptop className="mr-2 w-5 h-5" />
                    <span>Live Coding</span>
                  </Link>

                  <Link
                    href={`/profile/${decodedToken?.id}`}
                    prefetch={true}
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        className: "w-full justify-start text-white hover:bg-zinc-800",
                      })
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconUserCircle className="mr-2 w-5 h-5" />
                    <span>View Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        className: "w-full justify-start text-white hover:bg-zinc-800",
                      })
                    )}
                  >
                    <IconLogout className="mr-2 w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Music Player Section */}
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
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
    </>
  );
};

// Helper function to format time
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default LeftSidebar;
