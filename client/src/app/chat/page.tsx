"use client";
import { useEffect, useRef } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { useChatStore } from "@/store/useChatStore";
import { jwtDecode } from "jwt-decode";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatPage = () => {
  const {
    messages,
    selectedUser,
    fetchUsers,
    fetchMessages,
    users,
    isConnected,
    initSocket,
  } = useChatStore();
  const token = localStorage.getItem("token") || "";
  const decodedToken = jwtDecode<any>(token) || null;

  // Ref for scroll area to manage auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Initialize socket connection
  useEffect(() => {
    if (decodedToken?.id && !isConnected) {
      initSocket(decodedToken.id);
    }
  }, [initSocket, isConnected]);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser?._id) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser, fetchMessages]);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <UsersList />

        {/* Chat Messages */}
        <div className="flex flex-col h-full">
          {selectedUser ? (
            <>
              <ChatHeader />

              {/* Messages */}
              <ScrollArea className="h-[calc(100vh-340px)] overflow-y-auto">
                <div className="p-4 space-y-4">
                  {messages?.length ? (
                    messages.map((message) => {
                      const isSender = message.senderId === decodedToken?.id;

                      return (
                        <div
                          key={message._id}
                          className={`flex items-start gap-3 ${
                            isSender ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                isSender
                                  ? decodedToken?.profile_picture || "/default-avatar.png"
                                  : selectedUser?.profile_picture || "/default-avatar.png"
                              }
                              alt={isSender ? "You" : selectedUser?.username || "User"}
                            />
                          </Avatar>

                          <div
                            className={`rounded-lg p-3 max-w-[70%] ${
                              isSender ? "bg-green-500" : "bg-zinc-800"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <span className="text-xs text-zinc-300 mt-1 block">
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-zinc-500">No messages yet</div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="/spotify.png" alt="Spotify" className="h-16 w-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">No conversation selected</h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);
