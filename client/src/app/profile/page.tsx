'use client';

import React, { useState } from 'react';
import SkillsTags from './components/SkillsTags';
import ActivityGraph from './components/ActivityGraph';
import StatsSection from './components/StatsSection';
import ProfileHeader2 from './components/ProfileHeader2';

// Mock data
const sampleData = [
    { date: '2024-12-01', count: 5 },
    { date: '2024-12-02', count: 8 },
    { date: '2024-12-03', count: 2 },
    
  ];
const mockSkills = [
  'JavaScript', 'React', 'Node.js', 'TypeScript', 'Python',
  'AWS', 'Docker', 'GraphQL', 'MongoDB', 'PostgreSQL'
];

const ProfilePage = () => {
  const [profile] = useState({
    username: 'Sarah Chen',
    jobTitle: 'Senior Full Stack Developer',
    bio: 'Coding to the rhythm 🎵 | Building scalable systems by day, exploring new music by night | 5 years of turning coffee into code',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  });

  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProfileHeader2
          username={profile.username}
          jobTitle={profile.jobTitle}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
        />
        
        <div className="mt-6">
          <SkillsTags skills={mockSkills} />
        </div>

        <div className="mt-8">
          <ActivityGraph data={sampleData} />
        </div>

        <div className="mt-8">
          <StatsSection
            currentStreak={15}
            longestStreak={42}
            totalListeningTime="1,234 hours"
            topAlbum={{
              name: "Random Access Memories",
              artist: "Daft Punk",
              coverUrl: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=400",
              listens: 387
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;