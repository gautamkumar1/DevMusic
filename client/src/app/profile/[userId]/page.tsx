"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Flame, Github, Globe, Headphones, Linkedin, Loader2, Music, Share2, Trophy } from "lucide-react";
import ActivityGraph from "../components/ActivityGraph";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Params = {
  userId: string;
};

type UserData = {
  _id: string;
  role: string;
  username: string;
  email: string;
  profile_picture: string;
  bio: string;
  isBlocked: boolean;
  isAdmin: boolean;
  skills: string[];
  githubLink: string;
  linkedInLink: string;
  portfolioLink: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
};

type ProfileResponse = {
  message: string;
  userData: UserData;
  activities: any[];
};

const ProfilePage = () => {
  const { userId } = useParams<Params>();
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userActivity, setUserActivity] = useState<any[]>([]);

  const getUserData = async () => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data: ProfileResponse = await response.json();

      if (!response.ok) {
        toast.warning(data.message);
        return;
      }

      setProfileData(data.userData); 
      console.log(`profileData: ${JSON.stringify(data.userData)}`);
    } catch (err: any) {
      console.error(`Error while getting userData: ${err.message}`);
      setError(err.message);
      toast.error("Failed to fetch user data.");
    }
  };
  const getUserActivityData = async () => {
    try {
      const response = await fetch(`/api/singing-activity-get/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data: ProfileResponse = await response.json();

      if (!response.ok) {
        toast.warning(data.message);
        return;
      }

      setUserActivity(data.activities); 
      console.log(`userActivity: ${JSON.stringify(data.activities)}`);
    } catch (err: any) {
      console.error(`Error while getting userActivity: ${err.message}`);
      setError(err.message);
      toast.error("Failed to fetch user activity.");
    }
  };

  useEffect(() => {
    if (userId) {
      console.log(`userId: ${userId}`);
      getUserData();
      getUserActivityData();
    }
  }, [userId]);
  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${profileData?.fullName}'s Profile`,
        text: `Check out ${profileData?.fullName}'s profile!`,
        url: window.location.href,
      });
    } catch (err) {
      // Fallback if Web Share API is not supported
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    }
  };
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!profileData) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative rounded-lg bg-gray-800 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={profileData.profile_picture}
                alt={profileData.fullName}
                className="w-32 h-32 rounded-full border-4 border-orange-500 object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-orange-500 rounded-full p-2">
                <Trophy className="w-5 h-5" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-orange-100">
                {profileData.fullName}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="bg-orange-600 px-3 py-1 rounded-full text-sm">
                  {profileData.role}
                </span>
                <span className="bg-orange-700 px-3 py-1 rounded-full text-sm">
                  Rank #{Math.floor(Math.random() * 100) + 1}
                </span>
              </div>
              <p className="text-orange-200 max-w-2xl">{profileData.bio}</p>
            </div>

            {/* Connect Section */}
            <div className="flex flex-col gap-3 mt-4 md:mt-0">
              <Button
                onClick={handleShare}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Share2 className="w-5 h-5" />
                Share Profile
              </Button>
              {profileData.githubLink && (
                <a
                  href={profileData.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-orange-600/20 rounded-lg transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
              )}
              {profileData.linkedInLink && (
                <a
                  href={profileData.linkedInLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-orange-600/20 rounded-lg transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profileData.portfolioLink && (
                <a
                  href={profileData.portfolioLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-orange-600/20 rounded-lg transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-100">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-600/20 text-orange-400 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Graph */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-100">Activity</h2>
            <ActivityGraph data={userActivity} />
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold mb-2 text-orange-100">Current Streak</h3>
              </div>
              <div className="text-3xl font-bold text-orange-500">15 days</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold mb-2 text-orange-100">Longest Streak</h3>
              </div>
              <div className="text-3xl font-bold text-orange-500">42 days</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Headphones className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold mb-2 text-orange-100">Listening Time</h3>
              </div>
              <div className="text-3xl font-bold text-orange-500">1,234 hrs</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Music className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold mb-2 text-orange-100">Top Album</h3>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=400"
                  alt="Random Access Memories"
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <div className="font-semibold text-orange-100">Random Access Memories</div>
                  <div className="text-sm text-orange-400">Daft Punk · 387 plays</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

  );
}

const Page = () => {
  return (
   
      <ProfilePage />
    
  );
}

export default Page;
