import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	socket: any;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;

	fetchUsers: () => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
}

const baseURL = "http://localhost:3001";

const socket = io(baseURL, {
	autoConnect: false, // only connect if user is authenticated
	withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
	users: [],
	isLoading: false,
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,

	setSelectedUser: (user) => set({ selectedUser: user }),

	fetchUsers: async () => {
		set({ isLoading: true, error: null });
		try {
      const response = await fetch(`${baseURL}/api/allUsers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      const data = await response.json();
			set({ users: data.userData });
		} catch (error: any) {
			set({ error: error.response.data?.message });
		} finally {
			set({ isLoading: false });
		}
	},
	initSocket: (userId) => {
		if (!get().isConnected) {
			socket.auth = { userId };
			socket.connect();
			console.log(`Socket initialized for user: ${userId}`);
			socket.emit("user_connected", userId);

			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

			socket.on("receive_message", (message: Message) => {
				console.log("Received message:", message);

				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("message_sent", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			set({ isConnected: true });
		}
	},

	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	sendMessage: async (receiverId, senderId, content) => {
		const socket = get().socket;
		// console.log(`Socket: ${JSON.stringify(socket)}`);
		
		if (!socket) {
			console.error("Socket is not initialized.");
			return;
		}
		console.log(`receiverId: ${receiverId}`);
		
		console.log(`Sending message from ${senderId} to ${receiverId}: ${content}`);

		socket.emit("send_message", { receiverId, senderId, content });
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
      const response = await fetch(`${baseURL}/api/users/messages/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      const data = await response.json();
			set({ messages: data.messages });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));
