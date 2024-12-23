import React from 'react';
import { Edit2 } from 'lucide-react';

interface ProfileHeaderProps {
  username: string;
  role: string;
  bio: string;
  profile_picture: string;
}

const ProfileHeader2 = ({ username, role, bio, profile_picture }: ProfileHeaderProps) => {
  return (
    <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-800 rounded-lg">
      <div className="relative">
        <img
          src={profile_picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'}
          alt={username}
          className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
        />
      </div>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-bold text-white mb-2">{username}</h1>
        <p className="text-orange-400 text-lg mb-3">{role}</p>
        <p className="text-gray-300 max-w-2xl">{bio}</p>
      </div>
    </div>
  );
};

export default ProfileHeader2;
