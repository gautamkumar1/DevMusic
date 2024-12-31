import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/useChatStore";
import { jwtDecode } from "jwt-decode";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode<any>(token) : null;
	const { selectedUser, sendMessage } = useChatStore();

	const handleSend = () => {
		if (!selectedUser || !decodedToken || !newMessage) return;
		// console.log(`receiver Id from message input: ${JSON.stringify(selectedUser._id)}`);
		// console.log(`sender Id from message input: ${JSON.stringify(decodedToken.id)}`);
		// console.log(`newMessage: ${JSON.stringify(newMessage)}`);
		
		// console.log(`Sending message to ${selectedUser._id}: ${newMessage}`);
		sendMessage(selectedUser._id, decodedToken.id, newMessage.trim());
		setNewMessage("");
	};

	return (
		<div className='p-4 mt-auto border-t border-zinc-800'>
			<div className='flex gap-2'>
				<Input
					placeholder='Type a message'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className='bg-zinc-800 border-none'
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
				/>

				<Button size={"icon"} onClick={handleSend} disabled={!newMessage.trim()}>
					<Send className='size-4' />
				</Button>
			</div>
		</div>
	);
};
export default MessageInput;
