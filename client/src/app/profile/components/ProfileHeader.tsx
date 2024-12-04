import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileHeaderProps {
  imageUrl: string
  username: string
  bio: string
}

export default function ProfileHeader({ imageUrl, username, bio }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="w-32 h-32">
        <AvatarImage src={imageUrl} alt={username} />
        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <h1 className="mt-4 text-2xl font-bold">{username}</h1>
      <p className="mt-2 text-muted-foreground">{bio}</p>
    </div>
  )
}

