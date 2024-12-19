import { ReactNode } from 'react';
import { create } from 'zustand';

// Define the structure of an album
interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  language: string;
  releaseYear: number;
  songs: string[]; // Modify if songs have more detailed structure
}
interface featuredAlbum{
  language: ReactNode;
  releaseYear: ReactNode;
  songs: any;
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
}
// Define the state and actions of the Zustand store
interface AlbumStoreState {
  albums: Album[];
  featuredAlbums: featuredAlbum[];
  loading: boolean;
  error: string | null;
  fetchAlbums: () => Promise<void>;
  fetchFeaturedAlbums: () => Promise<void>;
}

const useAlbumStore = create<AlbumStoreState>((set) => ({
  albums: [],
  featuredAlbums: [],
  loading: false,
  error: null,

  // Fetch albums from API
  fetchAlbums: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/albums');
      if (!response.ok) {
        throw new Error(`Failed to fetch albums: ${response.statusText}`);
      }
      const data: { albums: Album[] } = await response.json();
      set({ albums: data.albums, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'An unknown error occurred', loading: false });
    }
  },
  fetchFeaturedAlbums: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/featured/albums');
      const data:featuredAlbum[] = await response.json();
      set({ featuredAlbums: data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'An unknown error occurred', loading: false });
    }
  },
}));

export default useAlbumStore;
