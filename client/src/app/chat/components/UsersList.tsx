"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/useChatStore";
import UsersListSkeleton from "./UsersListSkeleton";
import { IconUsers, IconSearch } from "@tabler/icons-react";

const UsersList = () => {
  const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } = useChatStore();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filtered users based on search term
  const filteredUsers = users?.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="h-full flex flex-col bg-zinc-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col border-b border-zinc-800/50">
        <div className="flex items-center px-4 h-14">
          <IconUsers className="w-5 h-5 text-zinc-400" />
          <h2 className="font-semibold text-sm text-zinc-100 ml-2">Users</h2>
        </div>
        {/* Search Bar */}
        <div className="px-4 pb-2">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Scrollable user list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <UsersListSkeleton />
          ) : filteredUsers?.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`group relative flex items-center gap-x-3 p-2 rounded-md 
                  transition-colors cursor-pointer 
                  ${
                    selectedUser?._id === user._id
                      ? "bg-zinc-800"
                      : "hover:bg-zinc-800/50"
                  }`}
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

                {/* User Info */}
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-zinc-100 truncate">
                    {user.username}
                  </span>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {onlineUsers.has(user._id) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-400 text-center mt-4">No users found.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UsersList;
