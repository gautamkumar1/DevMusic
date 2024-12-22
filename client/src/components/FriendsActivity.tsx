"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useChatStore } from "@/store/useChatStore";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { IconMusic, IconUsers } from "@tabler/icons-react";

const FriendsActivity: React.FC = () => {
  const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
    if (storedToken) {
      const decoded = jwtDecode<any>(storedToken);
      setUser(decoded.id);
    }
  }, []);

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  return (
    <div className="h-full flex flex-col bg-zinc-900/50 backdrop-blur-sm">
      {/* Header - Fixed height */}
      <div className="flex items-center px-4 h-14 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <IconUsers className="w-5 h-5 text-zinc-400" />
          <h2 className="font-semibold text-sm text-zinc-100">Friend Activity</h2>
        </div>
      </div>

      {/* Scrollable content area - Takes remaining height */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {users?.map((user) => {
            const activity = userActivities.get(user._id);
            const isPlaying = activity && activity !== "Idle";

            return (
              <div
                key={user._id}
                className="group relative flex items-center gap-x-3 p-2 rounded-md hover:bg-zinc-800/50 transition-colors"
              >
                {/* User Avatar with Online Status */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-9 w-9 border border-zinc-800">
                    <AvatarImage src={user.profile_picture} alt={user.username} />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 
                      ${onlineUsers.has(user._id) ? "bg-green-500" : "bg-zinc-500"}`}
                  />
                </div>

                {/* User Info and Activity */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-100 truncate">
                      {user.username}
                    </span>
                    {isPlaying && (
                      <IconMusic className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    )}
                  </div>

                  {isPlaying ? (
                    <div className="mt-0.5 space-y-0.5">
                      <p className="text-xs font-medium text-zinc-100 truncate">
                        {activity.replace("Playing ", "").split(" by ")[0]}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {activity.split(" by ")[1]}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-0.5 text-xs text-zinc-400">Idle</p>
                  )}
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