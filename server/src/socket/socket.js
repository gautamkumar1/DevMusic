const Server = require("socket.io").Server;
const  Message  = require("../models/message-model");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });

    const userSockets = new Map(); // {userId: socketId} -> userId is the key of socket id
    const userActivities = new Map(); // {userId: activity} -> userId is the key of activity

    io.on("connection", (socket) => {
        console.log("User connected with socket id : ", socket.id);
        socket.on("user_connected", (userId) => {
            userSockets.set(userId, socket.id);
            userActivities.set(userId, "Idle"); // Set default activity to Idle
            io.emit("user_connected", userId); // // broadcast to all connected sockets that this user just logged in
            socket.emit("users_online", Array.from(userSockets.keys()));
            io.emit("users_activities", Array.from(userActivities.entries()));
        })

        socket.on("updated_activity", ({ userId, activity }) => {
            console.log(`Updated activity for user ${userId}: ${activity}`);
            userActivities.set(userId, activity);
            io.emit("activity_updated", { userId, activity });
        });

        socket.on("send_message",async(data)=>{
            try {
                const {senderId,receiverId,content} = data;
                const messageCreated = await Message.create({senderId,receiverId,content});
                const receiverSocketId = userSockets.get(receiverId);
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("receive_message",messageCreated);
                }
                socket.emit("message_sent",messageCreated);
            } catch (error) {
                console.log(`Message error:::::::::::: ${error}`);
                socket.emit("message_error",error.message);
                
            }
        })
        socket.on("disconnect", () => {
            console.log("User disconnected with socket id : ", socket.id);
            let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				// find disconnected user
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
        });
    });
}

module.exports = initializeSocket;