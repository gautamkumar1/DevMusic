"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import MainLayout from "@/components/mainLayout/MainLayout";
import PrivateRoute from "@/components/PrivateRoute";
import StatsSection from "../components/StatsSection";
import SkillsTags from "../components/SkillsTags";
import ProfileHeader2 from "../components/ProfileHeader2";
import ActivityGraph from "../components/ActivityGraph";

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

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!profileData) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProfileHeader2
          profile_picture={profileData.profile_picture}
          username={profileData.fullName}
          bio={profileData.bio}
          role={profileData.role}
        />
        
        <div className="mt-6">
          <SkillsTags skills={profileData.skills} />
        </div>

        <div className="mt-8">
          <ActivityGraph data={userActivity} />
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
}

const Page = () => {
  return (
    <PrivateRoute>
      <ProfilePage />
    </PrivateRoute>
  );
}

export default Page;
