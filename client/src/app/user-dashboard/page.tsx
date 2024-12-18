"use client"
import MainLayout from "@/components/mainLayout/MainLayout";
import { Header } from "./components/header";
import { TrendingPlaylists } from "./components/trending-playlists";
import { useEffect, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { jwtDecode } from "jwt-decode";
import { useChatStore } from "@/store/useChatStore";
import PlaylistDetails from "./components/playlist-details";
interface Song {
  id: number
  title: string
  artist: string
  duration: string
}

interface Playlist {
  id: number
  _id: string
  title: string
  description: string
  imageUrl: string
  songs: Song[]
}

const Home = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const {
    isConnected,
    initSocket,
  } = useChatStore();
  const token = localStorage.getItem("token") || "";
  const decodedToken = jwtDecode<any>(token) || null;
// Initialize socket connection
useEffect(() => {
  if (decodedToken?.id && !isConnected) {
    initSocket(decodedToken.id);
  }
}, [initSocket, isConnected]);
  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
  }

  const handleBackToTrending = () => {
    setSelectedPlaylist(null)
  }

  return (
    <div className="min-h-screen h-full bg-[#18181B] overflow-y-auto">
      <Header />
      <main>
        {selectedPlaylist ? (
          <PlaylistDetails playlist={selectedPlaylist} onBack={handleBackToTrending} />
        ) : (
          <TrendingPlaylists onPlaylistSelect={handlePlaylistSelect} />
        )}
      </main>
    </div>
  )
}

const HomePage = () => {
  return (
    <PrivateRoute>
      <MainLayout>
      <Home/>
    </MainLayout>
    </PrivateRoute>
   
  );
};

export default HomePage;

