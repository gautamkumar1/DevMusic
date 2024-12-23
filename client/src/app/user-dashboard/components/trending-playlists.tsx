"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import useAlbumStore from '@/store/useAlbumStore';
import { IconLoader2 } from '@tabler/icons-react';

interface TrendingPlaylistsProps {
  onPlaylistSelect: (album: any) => void; // Adjusted type for album
}

export function TrendingPlaylists({ onPlaylistSelect }: TrendingPlaylistsProps) {
  const { albums, loading, error, fetchAlbums,fetchFeaturedAlbums,featuredAlbums } = useAlbumStore();

  useEffect(() => {
    fetchAlbums();
    fetchFeaturedAlbums();
  }, [fetchAlbums,fetchFeaturedAlbums]);

  if (loading) return <div className="flex justify-center items-center h-screen"><IconLoader2 className="animate-spin" /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      {/* show featured albums */}
      <h1
        className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 via-orange-500 to-pink-500 text-transparent bg-clip-text animate-bounce"
        style={{
          animation: "bounce 2s infinite",
        }}
      >
        🎵 Top Tracks for Techies
      </h1>
      {featuredAlbums && featuredAlbums.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAlbums.map((albumm) => (
              <div
                key={albumm._id}
                className="bg-[#18181B] rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 focus:scale-105 focus:outline-none cursor-pointer"
                onClick={() => onPlaylistSelect(albumm)}
                tabIndex={0}
                role="button"
                aria-label={`Open featured album ${albumm.title}`}
              >
                <Image
                  unoptimized
                  src={albumm.imageUrl}
                  alt={albumm.title}
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-white">{albumm.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">By {albumm.artist}</p>
                  <p className="text-gray-500 text-xs">
                    {albumm.songs.length} songs • Released in {albumm.releaseYear}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    Language: <span className="font-semibold">{albumm.language}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-400">Most Trending Albums</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {albums.map((album) => (
          <div
            key={album._id}
            className="bg-[#18181B] rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 focus:scale-105 focus:outline-none cursor-pointer"
            onClick={() => onPlaylistSelect(album)}
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
              <h3 className="font-semibold text-lg mb-1 text-white">{album.title}</h3>
              <p className="text-gray-400 text-sm mb-2">By {album.artist}</p>
              <p className="text-gray-500 text-xs">
                {album.songs.length} songs • Released in {album.releaseYear}
              </p>
              <p className="text-gray-400 text-xs mt-2">
          Language: <span className="font-semibold">{album.language}</span>
        </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
