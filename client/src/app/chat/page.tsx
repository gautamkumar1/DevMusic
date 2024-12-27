"use client";
import { useEffect, useRef,useState } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { useChatStore } from "@/store/useChatStore";
import { jwtDecode } from "jwt-decode";
import PrivateRoute from "@/components/PrivateRoute";
import MainLayout from "@/components/mainLayout/MainLayout";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const Chat = () => {
  const {
    messages,
    selectedUser,
    fetchUsers,
    fetchMessages,
    users,
    isConnected,
    initSocket,
  } = useChatStore();
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // This ensures the code runs only on the client side
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      const decoded = jwtDecode<any>(token);
      setDecodedToken(decoded);
    }
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (decodedToken?.id && !isConnected) {
      initSocket(decodedToken.id);
    }
  }, [initSocket, isConnected]);

  useEffect(() => {
    if (selectedUser?._id) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Main chat container */}
      <div className="flex-1 flex h-full">
        {/* Users list section - adjusted to be always visible */}
        <div className="w-[300px] border-r border-zinc-800 h-full">
          <UsersList />
        </div>

        {/* Chat messages section */}
        <div className="flex-1 flex flex-col h-full">
          {selectedUser ? (
            <div className="flex flex-col h-full">
              <ChatHeader />
              
              {/* Messages container with dynamic height */}
              <ScrollArea className="flex-1 px-4">
                <div className="py-4 space-y-4">
                  {messages?.length ? (
                    messages.map((message: any) => {
                      const isSender = message.senderId === decodedToken?.id;
                      return (
                        <div
                          key={message._id}
                          className={`flex items-start gap-3 ${
                            isSender ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Avatar className="h-8 w-8 flex-shrink-0">
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
                            <p className="text-sm break-words">{message.content}</p>
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

              {/* Message input fixed at bottom */}
              <div className="border-t border-zinc-800">
                <MessageInput />
              </div>
            </div>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => {
  return (
    <PrivateRoute>
      <MainLayout>
        <div className="h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
          <Chat />
        </div>
      </MainLayout>
    </PrivateRoute>
  );
};

export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">No conversation selected</h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);