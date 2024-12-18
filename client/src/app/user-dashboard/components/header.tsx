"use client";
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import useAlbumStore from '@/store/useAlbumStore';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
    <header className="bg-[#18181B] sticky top-0 z-40 w-full border-b border-[#2A2A2E]">
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
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
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
            <Menu className="h-6 w-6 text-gray-300" />
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>
      {/* Render filtered albums */}
      <div className="p-4">
        {loading && <p>Loading...</p>}
        {error && <p>Error loading albums.</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlbums.map((album) => (
              <div
                key={album._id}
                className="bg-[#18181B] rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 focus:scale-105 focus:outline-none cursor-pointer"
                onClick={() => console.log(`Selected album: ${album.title}`)}
                tabIndex={0}
                role="button"
                aria-label={`Open album ${album.title}`}
              >
                <Image
                  unoptimized
                  src={album.imageUrl}
                  alt={album.title}
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-white">{album?.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">By {album?.artist}</p>
                  <p className="text-gray-500 text-xs">
                    {album?.songs?.length} songs • Released in {album?.releaseYear}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    Language: <span className="font-semibold">{album.language}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
