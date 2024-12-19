"use client";
import Link from 'next/link';
// import { Search, Menu } from 'lucide-react';
import useAlbumStore from '@/store/useAlbumStore';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IconMenu, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

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
    <header className="bg-[#18181B] sticky top-0 z-40 w-full">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-white">DevMusic</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#"
              className="flex items-center text-lg font-semibold text-gray-300 hover:text-white sm:text-sm"
            >
              Discover
            </Link>
            <Link
              href="#"
              className="flex items-center text-lg font-semibold text-gray-300 hover:text-white sm:text-sm"
            >
              Library
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search albums..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] h-9 bg-[#1F1F23] py-2 text-sm text-white placeholder-gray-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md border border-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              />
            </div>
          </div>
          <button className="md:hidden">
            <IconMenu className="h-6 w-6 text-gray-300" />
            <span className="sr-only">Toggle menu</span>
          </button>
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
