import { Album, Song } from "@/types";
import { create } from "zustand";

interface MusicStoreState {
	albums: Album[];
	songs: Song[];
	loading: boolean;
    songLoading: boolean;
	error: string | null;
	fetchAlbums: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	totalUsers: number;
	totalSongs: number;
	totalAlbums: number;
	deleteAlbum: (albumId: string) => Promise<void>;  
    deleteSong: (songId: string) => Promise<void>;
}

const useMusicStore = create<MusicStoreState>((set) => ({
    albums: [],
    songs: [],
    loading: false,
    songLoading: false,
    error: null,
    totalUsers: 0,
    totalSongs: 0,
    totalAlbums: 0,
  
    fetchAlbums: async () => {
      try {
        set({ loading: true, error: null });
        const response = await fetch("/api/albums",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch albums: ${response.statusText}`);
        }
        const data = await response.json();
        set({ albums: data.albums, loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },
  
    fetchSongs: async () => {
      try {
        set({ loading: true, error: null });
        const response = await fetch("/api/songs",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch songs: ${response.statusText}`);
        }
        const data = await response.json();
        set({ songs: data.allSong, loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },
  
    fetchStats: async () => {
      try {
        set({ loading: true, error: null });
        const response = await fetch("/api/getallstats",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }
        const data = await response.json();
        set({
          totalUsers: data.totalUsers,
          totalSongs: data.totalSongs,
          totalAlbums: data.totalAlbums,
          loading: false,
        });
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },
    deleteAlbum: async (albumId: string) => {
      try {
        const response = await fetch(`/api/admin/albumDelete`, {
          method: "DELETE",
          body: JSON.stringify({ albumId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to delete album: ${response.statusText}`);
        }
        set((state) => ({ 
          albums: state.albums.filter((album: { _id: string }) => album._id !== albumId) 
        }));
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },
    deleteSong: async (songId: string) => {
        set({songLoading: true, error: null});
      try {
        const response = await fetch(`/api/admin/songDelete`, {
          method: "DELETE",
          body: JSON.stringify({ songId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to delete song: ${response.statusText}`);
        }
        set((state) => ({ 
          songs: state.songs.filter((song: { _id: string }) => song._id !== songId) 
        }));
      } catch (error: any) {
        set({ error: error.message, songLoading: false });
      }
    }
  }));
export default useMusicStore;

