
import { ScrollArea } from "@/components/ui/scroll-area";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useChatStore } from "@/store/useChatStore";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

// Hardcoded user data
const hardcodedUsers = [
  {
    _id: "1",
    fullName: "Alice Johnson",
    imageUrl: "https://via.placeholder.com/150",
    isOnline: true,
    activity: "Playing Chill Beats by Lo-Fi Studio",
  },
  {
    _id: "2",
    fullName: "Bob Smith",
    imageUrl: "https://via.placeholder.com/150",
    isOnline: false,
    activity: "Idle",
  },
  {
    _id: "3",
    fullName: "Charlie Brown",
    imageUrl: "https://via.placeholder.com/150",
    isOnline: true,
    activity: "Playing Workout Hits by Top Artists",
  },
];

const FriendsActivity: React.FC = () => {
  const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
  const token = localStorage.getItem("token") || "";
  const decodedToken = jwtDecode<any>(token) || null;
  const user = decodedToken.id;
  useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);
  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 shrink-0" />
          <h2 className="font-semibold text-white">What they're listening to</h2>
        </div>
      </div>
      
      <ScrollArea className='flex-1'>
				<div className='p-4 space-y-4'>
					{users?.map((user) => {
						const activity = userActivities.get(user._id);
						const isPlaying = activity && activity !== "Idle";

						return (
							<div
								key={user._id}
								className='cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group'
							>
								<div className='flex items-start gap-3'>
									<div className='relative'>
										<Avatar className='size-10 border border-zinc-800'>
											<AvatarImage src={user.profile_picture} alt={user.username} />
											<AvatarFallback>{user.username[0]}</AvatarFallback>
										</Avatar>
										<div
											className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
												${onlineUsers.has(user._id) ? "bg-green-500" : "bg-zinc-500"}
												`}
											aria-hidden='true'
										/>
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex items-center gap-2'>
											<span className='font-medium text-sm text-white'>{user.username}</span>
											{isPlaying && <Music className='size-3.5 text-emerald-400 shrink-0' />}
										</div>

										{isPlaying ? (
											<div className='mt-1'>
												<div className='mt-1 text-sm text-white font-medium truncate'>
													{activity.replace("Playing ", "").split(" by ")[0]}
												</div>
												<div className='text-xs text-zinc-400 truncate'>
													{activity.split(" by ")[1]}
												</div>
											</div>
										) : (
											<div className='mt-1 text-xs text-zinc-400'>Idle</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</ScrollArea>
    </div>
  );
};

export default FriendsActivity;
