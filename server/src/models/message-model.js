const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		senderId: { type: String, required: true }, // user ID
		receiverId: { type: String, required: true }, // user ID
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
