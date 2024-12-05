"use client";
import { HomeIcon, Library, MessageCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { useRouter } from 'next/navigation'
import { jwtDecode } from "jwt-decode";

const LeftSidebar = () => {
  const router = useRouter()
  const { isLoggedIn } = useUserStore(); 
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode<any>(token) : null;
  const handleLogout = () => {
    localStorage.removeItem("token");
    useUserStore.getState().clearState();
    toast.success("Logout successful!");
    router.push("/")
  };

  const albums = [
    {
      _id: "1",
      title: "Chill Vibes",
      artist: "Various Artists",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      _id: "2",
      title: "Coding Beats",
      artist: "Lo-Fi Studio",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      _id: "3",
      title: "Workout Hits",
      artist: "Top Artists",
      imageUrl: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          {/* Always show Home */}
          <Link
            href="/"
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
                href="/live-coding"
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

      {/* Library section */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="w-5 h-5 mr-2" />
            <span className="hidden md:inline">Playlists</span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {albums.map((album) => (
              <Link
                href={`/albums/${album._id}`}
                key={album._id}
                className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
              >
                <img
                  src={album.imageUrl}
                  alt={`${album.title} cover`}
                  className="w-12 h-12 rounded-md flex-shrink-0 object-cover"
                />

                <div className="flex-1 min-w-0 hidden md:block">
                  <p className="font-medium truncate">{album.title}</p>
                  <p className="text-sm text-zinc-400 truncate">
                    Album • {album.artist}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
