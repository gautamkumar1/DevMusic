"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ContactInfo from "../components/ContactInfo";
import ProfileHeader from "../components/ProfileHeader";
import Skills from "../components/Skills";
import { Loader2 } from "lucide-react";
import MainLayout from "@/components/mainLayout/MainLayout";
import PrivateRoute from "@/components/PrivateRoute";

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
};

type ProfileResponse = {
  message: string;
  userData: UserData;
};

const ProfilePage = () => {
  const { userId } = useParams<Params>();
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getUserData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/${userId}`, {
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

  useEffect(() => {
    if (userId) {
      console.log(`userId: ${userId}`);
      getUserData();
    }
  }, [userId]);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!profileData) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Header */}
        <ProfileHeader
          profile_picture={profileData.profile_picture}
          username={profileData.username}
          bio={profileData.bio}
          role={profileData.role}
        />

        {/* Contact Information */}
        <ContactInfo
          email={profileData.email}
          githubLink={profileData.githubLink}
          portfolioLink={profileData.portfolioLink}
          linkedinLink={profileData.linkedInLink}
        />

        {/* Skills Section */}
        <Skills skills={profileData.skills} />
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <PrivateRoute>
    <MainLayout>
      <ProfilePage />
    </MainLayout>
    </PrivateRoute>
  );
}

export default Page;
