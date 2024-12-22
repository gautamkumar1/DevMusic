"use client"

import MainLayout from "@/components/mainLayout/MainLayout";
import { Header } from "./components/header";
import { TrendingPlaylists } from "./components/trending-playlists";
import { useEffect, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { jwtDecode } from "jwt-decode";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "next/navigation";

interface Song {
  id: number
  title: string
  artist: string
  duration: string
}

interface Playlist {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  albumId: string;
  songs: Song[];
}

const Home = () => {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const {
    isConnected,
    initSocket,
  } = useChatStore();

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
    if (storedToken) {
      setDecodedToken(jwtDecode<any>(storedToken));
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (decodedToken?.id && !isConnected) {
      initSocket(decodedToken.id);
    }
  }, [initSocket, isConnected, decodedToken]);

  const handlePlaylistSelect = (playlist: Playlist) => {
    router.push(`/user-dashboard/playlist-details/${playlist._id}`);
  }

  return (
    <div className="min-h-screen h-full bg-[#18181B] overflow-y-auto">
      <Header />
      <main>
        <TrendingPlaylists onPlaylistSelect={handlePlaylistSelect} />
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