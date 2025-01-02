"use client";
import { useParams } from "next/navigation";
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Flame, Github, Globe, Headphones, Linkedin, Loader2, Music, Share2, Trophy, Edit2 } from "lucide-react";
import ActivityGraph from "../components/ActivityGraph";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ... (keep existing type definitions)
type Params = {
  userId: string;
};

type UserData = {
  skillsTemp?: string; // Add this line
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
type LeaderboardEntry = {
  rank: number
  fullName: string
  totalPlayingTime: number
}
const ProfilePage = () => {
  const { userId } = useParams<Params>();
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<UserData> & { profilePictureFile?: File | null }>({});
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
      // console.log(`profileData: ${JSON.stringify(data.userData)}`);
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
      // console.log(`userActivity: ${JSON.stringify(data.activities)}`);
    } catch (err: any) {
      console.error(`Error while getting userActivity: ${err.message}`);
      setError(err.message);
      toast.error("Failed to fetch user activity.");
    }
  };
  const fetchLeaderBoardData = async () => {
    try {
      const response = await fetch("/api/leaderboard-rank");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const responseData = await response.json();
      setData(responseData.leaderboard)
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFormData(prev => ({
        ...prev,
        profilePictureFile: file
      }));
    }
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData || !profileData) return;
  
    setIsUpdating(true);
  
    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append('username', editFormData.username || profileData.username);
      formData.append('email', editFormData.email || profileData.email);
      formData.append('bio', editFormData.bio || profileData.bio);
      formData.append('role', editFormData.role || profileData.role);
      formData.append('linkedInLink', editFormData.linkedInLink || profileData.linkedInLink);
      formData.append('portfolioLink', editFormData.portfolioLink || profileData.portfolioLink);
      formData.append('githubLink', editFormData.githubLink || profileData.githubLink);
      formData.append('fullName', editFormData.fullName || profileData.fullName);
  
      // Fix for skills array - Convert comma-separated string to array
      if (editFormData.skillsTemp) {
        const skillsArray = editFormData.skillsTemp
          .split(',')
          .map(skill => skill.trim())
          .filter(Boolean);
        
        // Add each skill as a separate entry in formData
        skillsArray.forEach((skill, index) => {
          formData.append(`skills[${index}]`, skill);
        });
      } else {
        formData.append('skills', '[]'); // Empty array if no skills
      }
      
      // Handle file upload
      if (editFormData.profilePictureFile) {
        formData.append('profile_picture', editFormData.profilePictureFile);
      }
  
      const response = await fetch(`/api/updateProfile/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
  
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      getUserData(); // Refresh the profile data
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    if (profileData && !editFormData) {
      setEditFormData({
        ...profileData,
        skillsTemp: profileData.skills.join(', '),
      });

    }

  }, [profileData]);
  useEffect(() => {
    if (userId) {
      getUserData();
      getUserActivityData();
      fetchLeaderBoardData();
    }
  }, [userId]);
  useEffect(() => {
    if (profileData && data.length > 0) {
      const matchingEntry = data.find(
        (entry) => entry.fullName === profileData.fullName
      );
      setUserRank(matchingEntry ? matchingEntry.rank : null);
    }
  }, [profileData, data]);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative rounded-lg bg-gray-800 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={profileData?.profile_picture}
                alt={profileData?.fullName}
                className="w-32 h-32 rounded-full border-4 border-orange-500 object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-orange-500 rounded-full p-2">
                <Trophy className="w-5 h-5" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-orange-100">
                {profileData?.fullName}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="bg-orange-600 px-3 py-1 rounded-full text-sm">
                  {profileData?.role}
                </span>
                <span className="bg-orange-700 px-3 py-1 rounded-full text-sm">
                  {userRank !== null ? `Rank #${userRank}` : "Rank not available"}
                </span>
              </div>
              <p className="text-orange-200 max-w-2xl">{profileData?.bio}</p>
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

              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Edit2 className="w-5 h-5" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="bg-gray-800 text-orange-50 max-h-[80vh] overflow-y-auto"
                >
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm">Profile Picture</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-gray-700 text-white"
                      />
                      {editFormData.profilePictureFile && (
                        <p className="text-sm text-orange-300 mt-1">
                          Selected file: {editFormData.profilePictureFile.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm">Full Name</label>
                      <Input
                        value={editFormData?.fullName || profileData?.fullName || ''}
                        onChange={(e) =>
                          setEditFormData((prev: any) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        className="bg-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Username</label>
                      <Input
                        value={editFormData?.username || profileData?.username || ''}
                        onChange={(e) =>
                          setEditFormData((prev: any) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className="bg-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Role</label>
                      <Input
                        value={editFormData?.role || profileData?.role || ''}
                        onChange={(e) =>
                          setEditFormData((prev: any) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        className="bg-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Email</label>
                      <Input
                        type="email"
                        value={editFormData?.email || profileData?.email || ''}
                        onChange={(e) =>
                          setEditFormData((prev: any) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="bg-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Bio</label>
                      <Textarea
                        value={editFormData?.bio || profileData?.bio || ''}
                        onChange={(e) =>
                          setEditFormData((prev: any) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        className="bg-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Skills (comma-separated)</label>
                      <Input
                        value={editFormData?.skillsTemp || ''} // Use a temporary string
                        onChange={(e) =>
                          setEditFormData((prev: any) => ({
                            ...prev,
                            skillsTemp: e.target.value, // Update the temp string
                          }))
                        }
                        onBlur={() =>
                          setEditFormData((prev: any) => ({
                            ...prev,
                            skills: prev.skillsTemp
                              ? prev.skillsTemp
                                .split(',')
                                .map((s: string) => s.trim())
                                .filter(Boolean) // Update the actual skills array on blur
                              : [],
                          }))
                        }
                        placeholder="Enter skills separated by commas"
                        className="bg-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm">GitHub Link</label>
                      <Input
                        value={editFormData?.githubLink || profileData?.githubLink || ''}
                        onChange={(e) =>
                          setEditFormData((prev: any) => ({
                            ...prev,
                            githubLink: e.target.value,
                          }))
                        }
                        className="bg-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm">LinkedIn Link</label>
                      <Input
                        value={editFormData?.linkedInLink || profileData?.linkedInLink || ''}
                        onChange={(e) =>
                          setEditFormData((prev: any) => ({
                            ...prev,
                            linkedInLink: e.target.value,
                          }))
                        }
                        className="bg-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Portfolio Link</label>
                      <Input
                        value={editFormData?.portfolioLink || profileData?.portfolioLink || ''}
                        onChange={(e) =>
                          setEditFormData((prev: any) => ({
                            ...prev,
                            portfolioLink: e.target.value,
                          }))
                        }
                        className="bg-gray-700 text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        className="text-orange-100 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>

              </Dialog>

              {/* ... (keep existing social links) */}
              {profileData?.githubLink && (
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
              {profileData?.linkedInLink && (
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
              {profileData?.portfolioLink && (
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

        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-100">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profileData?.skills.map((skill: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
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

        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-100">Activity</h2>
            <ActivityGraph data={userActivity} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;