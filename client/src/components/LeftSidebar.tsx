"use client";
import { HomeIcon, Library, MessageCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

const LeftSidebar = () => {
  // Hardcoded album data
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
