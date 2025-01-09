"use client";
import Link from 'next/link';
// import { Search, Menu } from 'lucide-react';
import useAlbumStore from '@/store/useAlbumStore';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IconMenu, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Define the Album interface
interface Album {
  _id: string;
  title: string;
  artist: string;
  language: string;
  releaseYear: number;
  songs: Array<any>; // You can type this array more specifically based on the actual structure
  imageUrl: string;
}

export function Header() {
  const { albums, loading, error, fetchAlbums } = useAlbumStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([]); // Use the Album type here
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  // Filter albums based on search query without changing the case
  useEffect(() => {
    const filtered = albums.filter(
      (album: Album) => // Ensure TypeScript knows the type here
        album.title.includes(searchQuery) ||
        album.artist.includes(searchQuery) ||
        album.language.includes(searchQuery)
    );
    setFilteredAlbums(filtered);
  }, [searchQuery, albums]);

  return (
    <header  className="bg-[#18181B] sticky top-0 z-40 w-full border-b border-zinc-800">
       <div className="container mx-auto px-4">
  <div className="flex h-16 items-center gap-4">
    {/* Logo - Shown on all screens when search is closed, hidden on mobile when search is open */}
    <div
      className={cn(
        "flex items-center",
        isSearchOpen && "hidden sm:flex"
      )}
    >
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-lg font-bold text-white">DevMusic</span>
      </Link>
    </div>

    {/* Search Container */}
    <div
      className={cn(
        "flex items-center ml-auto",
        isSearchOpen ? "flex-1 sm:flex-initial" : "w-auto"
      )}
    >
      {/* Mobile Search Toggle */}
      <button
        className={cn(
          "sm:hidden p-2 text-gray-400 hover:text-white transition-colors",
          isSearchOpen && "hidden"
        )}
        onClick={() => setIsSearchOpen(true)}
        aria-label="Open search"
      >
        <IconSearch className="h-5 w-5" />
      </button>

      {/* Search Input */}
      <div
        className={cn(
          "relative",
          isSearchOpen ? "w-full" : "hidden sm:block"
        )}
      >
        <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search albums..."
          className={cn(
            "h-9 rounded-md border border-gray-600 bg-[#1F1F23] py-2",
            "text-sm text-white placeholder-gray-500",
            "ring-offset-background focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-orange-500",
            "focus-visible:ring-offset-2 disabled:cursor-not-allowed",
            "disabled:opacity-50 pl-9",
            isSearchOpen ? "w-full" : "w-[200px] lg:w-[300px]"
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Mobile Close Search Button */}
        {isSearchOpen && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white sm:hidden"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
          >
            <span className="text-sm">✕</span>
          </button>
        )}
      </div>
    </div>

    {/* Right section - hidden on mobile when search is open */}
    <div
      className={cn(
        "flex items-center gap-4",
        isSearchOpen && "hidden sm:flex"
      )}
    >
      {/* Add any additional header items here */}
    </div>
  </div>
</div>

      {/* Move filtered albums to a separate container with proper z-index and positioning */}
      {searchQuery && (
        <div className="absolute left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-b-lg shadow-lg z-30">
          <div className="container p-4">
            {filteredAlbums.length > 0 ? (
              <div className="max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAlbums.map((album) => (
                    <div
                      key={album._id}
                      className="bg-zinc-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 focus:scale-105 focus:outline-none cursor-pointer"
                      onClick={() => router.push(`/user-dashboard/playlist-details/${album._id}`)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Open album ${album.title}`}
                    >
                      <div className="flex items-center p-3 gap-3">
                        <Image
                          unoptimized
                          src={album.imageUrl}
                          alt={album.title}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-white truncate">{album.title}</h3>
                          <p className="text-zinc-400 text-xs truncate">By {album.artist}</p>
                          <p className="text-zinc-500 text-xs mt-1">{album.language}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-zinc-400 text-sm">No albums found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
