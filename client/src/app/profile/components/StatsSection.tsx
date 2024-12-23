import React from 'react';
import { Flame, Clock, Music } from 'lucide-react';

interface StatsProps {
  currentStreak: number;
  longestStreak: number;
  totalListeningTime: string;
  topAlbum: {
    name: string;
    artist: string;
    coverUrl: string;
    listens: number;
  };
}

const StatsSection = ({ currentStreak, longestStreak, totalListeningTime, topAlbum }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-6 bg-gray-800 rounded-lg flex items-center">
        <Flame className="w-8 h-8 text-orange-500 mr-4" />
        <div>
          <p className="text-gray-400 text-sm">Current Streak</p>
          <p className="text-2xl font-bold text-white">{currentStreak} days</p>
        </div>
      </div>

      <div className="p-6 bg-gray-800 rounded-lg flex items-center">
        <Flame className="w-8 h-8 text-red-500 mr-4" />
        <div>
          <p className="text-gray-400 text-sm">Longest Streak</p>
          <p className="text-2xl font-bold text-white">{longestStreak} days</p>
        </div>
      </div>

      <div className="p-6 bg-gray-800 rounded-lg flex items-center">
        <Clock className="w-8 h-8 text-orange-500 mr-4" />
        <div>
          <p className="text-gray-400 text-sm">Total Listening Time</p>
          <p className="text-2xl font-bold text-white">{totalListeningTime}</p>
        </div>
      </div>

      <div className="p-6 bg-gray-800 rounded-lg">
        <div className="flex items-center mb-3">
          <Music className="w-6 h-6 text-orange-500 mr-2" />
          <p className="text-gray-400">Most Played Album</p>
        </div>
        <div className="flex items-center">
          <img
            src={topAlbum.coverUrl}
            alt={topAlbum.name}
            className="w-16 h-16 rounded-md object-cover mr-3"
          />
          <div>
            <p className="font-semibold text-white">{topAlbum.name}</p>
            <p className="text-sm text-gray-400">{topAlbum.artist}</p>
            <p className="text-sm text-orange-400">{topAlbum.listens} plays</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;