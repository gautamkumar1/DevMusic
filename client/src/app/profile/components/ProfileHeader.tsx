import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  profile_picture: string;
  username: string;
  bio: string;
  role: string; // New prop for role
}

export default function ProfileHeader({
  profile_picture,
  username,
  bio,
  role,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Avatar */}
      <Avatar className="w-32 h-32">
        <AvatarImage src={profile_picture} alt={username} />
        <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Username */}
      <h1 className="mt-4 text-2xl font-bold">{username}</h1>

      {/* Role */}
      <span className="mt-1 text-sm font-medium text-blue-600">
        {role} {/* Add appropriate styling */}
      </span>

      {/* Bio */}
      <p className="mt-2 text-muted-foreground">{bio}</p>
    </div>
  );
}
