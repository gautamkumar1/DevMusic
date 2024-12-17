// import { Button } from "@/components/ui/button";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogFooter,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import useMusicStore from "@/store/useMusicStore";
// import { Plus, Upload } from "lucide-react";
// import { useRef, useState } from "react";
// import { toast } from "sonner";

// interface NewSong {
// 	title: string;
// 	artist: string;
// 	albumId: string;
// 	duration: string;
// }

// const AddSongDialog = () => {
// 	const { albums } = useMusicStore();
// 	const [songDialogOpen, setSongDialogOpen] = useState(false);
// 	const [isLoading, setIsLoading] = useState(false);

// 	const [newSong, setNewSong] = useState<NewSong>({
// 		title: "",
// 		artist: "",
// 		albumId: "",
// 		duration: "0",
// 	});

// 	const [files, setFiles] = useState<{ audioUrl: File | null; imageUrl: File | null }>({
// 		audioUrl: null,
// 		imageUrl: null,
// 	});

// 	const audioInputRef = useRef<HTMLInputElement>(null);
// 	const imageInputRef = useRef<HTMLInputElement>(null);

// 	const handleSubmit = async () => {
// 		setIsLoading(true);

// 		try {
// 			if (!files.audioUrl || !files.imageUrl) {
// 				return toast.error("Please upload both audio and image files");
// 			}

// 			const formData = new FormData();

// 			formData.append("title", newSong.title);
// 			formData.append("artist", newSong.artist);
// 			formData.append("duration", newSong.duration);
// 			if (newSong.albumId && newSong.albumId !== "none") {
// 				formData.append("albumId", newSong.albumId);
// 			}

// 			formData.append("audioUrl", files.audioUrl);
// 			formData.append("imageUrl", files.imageUrl);

// 			const response = await fetch("/api/admin/songCreate",{
// 				method: "POST",
// 				body: formData,
// 				headers: {
// 					Authorization: `Bearer ${localStorage.getItem("token")}`,
// 				},
// 			})
// 			const data = await response.json();
// 			if(!response.ok){
// 				toast.warning(data.message);
// 				return;
// 			}
			
// 			console.log(`songData????  ${data.songData}`);

// 			setNewSong({
// 				title: "",
// 				artist: "",
// 				albumId: "",
// 				duration: "0",
// 			});

// 			setFiles({
// 				audioUrl: null,
// 				imageUrl: null,
// 			});
// 			toast.success("Song added successfully");
// 		} catch (error: any) {
// 			toast.error("Failed to add song: " + error.message);
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	return (
// 		<Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
// 			<DialogTrigger asChild>
// 				<Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
// 					<Plus className='mr-2 h-4 w-4' />
// 					Add Song
// 				</Button>
// 			</DialogTrigger>

// 			<DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
// 				<DialogHeader>
// 					<DialogTitle>Add New Song</DialogTitle>
// 					<DialogDescription>Add a new song to your music library</DialogDescription>
// 				</DialogHeader>

// 				<div className='space-y-4 py-4'>
// 					<input
// 						type='file'
// 						accept='audio/*'
// 						ref={audioInputRef}
// 						hidden
// 						onChange={(e) => setFiles((prev) => ({ ...prev, audioUrl: e.target.files![0] }))}
// 					/>

// 					<input
// 						type='file'
// 						ref={imageInputRef}
// 						className='hidden'
// 						accept='image/*'
// 						onChange={(e) => setFiles((prev) => ({ ...prev, imageUrl: e.target.files![0] }))}
// 					/>

// 					{/* image upload area */}
// 					<div
// 						className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
// 						onClick={() => imageInputRef.current?.click()}
// 					>
// 						<div className='text-center'>
// 							{files.imageUrl ? (
// 								<div className='space-y-2'>
// 									<div className='text-sm text-emerald-500'>Image selected:</div>
// 									<div className='text-xs text-zinc-400'>{files.imageUrl.name.slice(0, 20)}</div>
// 								</div>
// 							) : (
// 								<>
// 									<div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
// 										<Upload className='h-6 w-6 text-zinc-400' />
// 									</div>
// 									<div className='text-sm text-zinc-400 mb-2'>Upload artwork</div>
// 									<Button variant='outline' size='sm' className='text-xs'>
// 										Choose File
// 									</Button>
// 								</>
// 							)}
// 						</div>
// 					</div>

// 					{/* Audio upload */}
// 					<div className='space-y-2'>
// 						<label className='text-sm font-medium'>Audio File</label>
// 						<div className='flex items-center gap-2'>
// 							<Button variant='outline' onClick={() => audioInputRef.current?.click()} className='w-full'>
// 								{files.audioUrl ? files.audioUrl.name.slice(0, 20) : "Choose Audio File"}
// 							</Button>
// 						</div>
// 					</div>

// 					{/* other fields */}
// 					<div className='space-y-2'>
// 						<label className='text-sm font-medium'>Title</label>
// 						<Input
// 							value={newSong.title}
// 							onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
// 							className='bg-zinc-800 border-zinc-700'
// 						/>
// 					</div>

// 					<div className='space-y-2'>
// 						<label className='text-sm font-medium'>Artist</label>
// 						<Input
// 							value={newSong.artist}
// 							onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
// 							className='bg-zinc-800 border-zinc-700'
// 						/>
// 					</div>

// 					<div className='space-y-2'>
// 						<label className='text-sm font-medium'>Duration (seconds)</label>
// 						<Input
// 							type='number'
// 							min='0'
// 							value={newSong.duration}
// 							onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })}
// 							className='bg-zinc-800 border-zinc-700'
// 						/>
// 					</div>

// 					<div className='space-y-2'>
// 						<label className='text-sm font-medium'>Album (Optional)</label>
// 						<Select
// 							value={newSong.albumId}
// 							onValueChange={(value) => setNewSong({ ...newSong, albumId: value })}
// 						>
// 							<SelectTrigger className='bg-zinc-800 border-zinc-700'>
// 								<SelectValue placeholder='Select album' />
// 							</SelectTrigger>
// 							<SelectContent className='bg-zinc-800 border-zinc-700'>
// 								<SelectItem value='none'>No Album (Single)</SelectItem>
// 								{albums.map((album) => (
// 									<SelectItem key={album._id} value={album._id}>
// 										{album.title}
// 									</SelectItem>
// 								))}
// 							</SelectContent>
// 						</Select>
// 					</div>
// 				</div>

// 				<DialogFooter>
// 					<Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
// 						Cancel
// 					</Button>
// 					<Button onClick={handleSubmit} disabled={isLoading}>
// 						{isLoading ? "Uploading..." : "Add Song"}
// 					</Button>
// 				</DialogFooter>
// 			</DialogContent>
// 		</Dialog>
// 	);
// };
// export default AddSongDialog;


//------------------------------------------- Testing code -------------------------------------------

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useMusicStore from "@/store/useMusicStore";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import * as mm from "music-metadata";

interface NewSong {
	title: string;
	artist: string;
	albumId: string;
	duration: string;
}

const AddSongDialog = () => {
	const { albums } = useMusicStore();
	const [songDialogOpen, setSongDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [newSong, setNewSong] = useState<NewSong>({
		title: "",
		artist: "",
		albumId: "",
		duration: "0",
	});

	// const [files, setFiles] = useState<{ audioUrl: File | null; imageUrl: File | null }>({
	// 	audioUrl: null,
	// 	imageUrl: null,
	// });
	const [files, setFiles] = useState<{ 
		audioUrl: File | null; 
		imageUrl: File | Blob | null 
	}>({
		audioUrl: null,
		imageUrl: null,
	});
	const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	// Extract metadata from the audio file
	const extractMetadata = async (audioFile: File) => {
		console.log("Extracting metadata from audio file:", audioFile.name);
	
		try {
			const metadata = await mm.parseBlob(audioFile);
			console.log("Extracted Metadata:", metadata);
	
			// Extract title, artist, duration
			const title = metadata.common.title || "Unknown Title";
			const artist = metadata.common.artist || "Unknown Artist";
			const duration = metadata.format.duration || 0; // duration in seconds
	
			// Log extracted values
			console.log("Title:", title);
			console.log("Artist:", artist);
			console.log("Duration (seconds):", duration);
	
			// Automatically set extracted data
			setNewSong((prev) => ({
				...prev,
				title,
				artist,
				duration: duration.toFixed(0), // Convert to integer seconds
			}));
	
			// Extract and set the image (album artwork)
			if (metadata.common.picture && metadata.common.picture.length > 0) {
				const picture = metadata.common.picture[0]; // Use the first image
				const blob = new Blob([picture.data], { type: picture.format });
				const imageUrl = URL.createObjectURL(blob);
	
				console.log("Extracted image:", imageUrl);
	
				// Set the image URL in the state
				setFiles((prev) => ({
					...prev,
					imageUrl: blob,
				}));
	
				toast.success("Image and metadata extracted successfully!");
			} else {
				console.log("No embedded image found in the audio file.");
				toast.info("No album artwork found.");
			}
		} catch (error) {
			toast.error("Failed to extract metadata");
			console.error("Error extracting metadata:", error);
		}
	};
	
	const handleAudioFileChange = (file: File | null) => {
		if (file) {
			console.log("Audio file selected:", file.name);
			setFiles((prev) => ({ ...prev, audioUrl: file }));
			extractMetadata(file);
		} else {
			console.log("No audio file selected");
		}
	};

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!files.audioUrl || !files.imageUrl) {
				return toast.error("Please upload both audio and image files");
			}

			console.log("Submitting new song:", newSong);
			console.log("Audio file:", files.audioUrl);
			console.log("Image file:", files.imageUrl);

			const formData = new FormData();

			formData.append("title", newSong.title);
			formData.append("artist", newSong.artist);
			formData.append("duration", newSong.duration);
			if (newSong.albumId && newSong.albumId !== "none") {
				formData.append("albumId", newSong.albumId);
			}

			formData.append("audioUrl", files.audioUrl);
			formData.append("imageUrl", files.imageUrl);

			const response = await fetch("/api/admin/songCreate", {
				method: "POST",
				body: formData,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			const data = await response.json();

			if (!response.ok) {
				console.log("Failed to submit song:", data.message);
				toast.warning(data.message);
				return;
			}

			console.log("Song added successfully:", data);

			setNewSong({
				title: "",
				artist: "",
				albumId: "",
				duration: "0",
			});

			setFiles({
				audioUrl: null,
				imageUrl: null,
			});

			toast.success("Song added successfully");
			window.location.reload();
		} catch (error: any) {
			console.error("Error submitting song:", error);
			toast.error("Failed to add song: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
			<DialogTrigger asChild>
				<Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
					<Plus className="mr-2 h-4 w-4" />
					Add Song
				</Button>
			</DialogTrigger>

			<DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
				<DialogHeader>
					<DialogTitle>Add New Song</DialogTitle>
					<DialogDescription>Add a new song to your music library</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<input
						type="file"
						accept="audio/*"
						ref={audioInputRef}
						hidden
						onChange={(e) => handleAudioFileChange(e.target.files![0])}
					/>

					<input
						type="file"
						ref={imageInputRef}
						className="hidden"
						accept="image/*"
						onChange={(e) => setFiles((prev) => ({ ...prev, imageUrl: e.target.files![0] }))}
					/>

					{/* image upload area */}
					<div
						className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
						onClick={() => imageInputRef.current?.click()}
					>
						<div className="text-center">
							{files?.imageUrl ? (
								<div className="space-y-2">
									<div className="text-sm text-emerald-500">Image selected:</div>
									<div className="text-xs text-zinc-400">{(files?.imageUrl as File).name?.slice(0, 20)}</div>
								</div>
							) : (
								<>
									<div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
										<Upload className="h-6 w-6 text-zinc-400" />
									</div>
									<div className="text-sm text-zinc-400 mb-2">Upload artwork</div>
									<Button variant="outline" size="sm" className="text-xs">
										Choose File
									</Button>
								</>
							)}
						</div>
					</div>

					{/* Audio upload */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Audio File</label>
						<div className="flex items-center gap-2">
							<Button variant="outline" onClick={() => audioInputRef.current?.click()} className="w-full">
								{files.audioUrl ? files.audioUrl.name.slice(0, 20) : "Choose Audio File"}
							</Button>
						</div>
					</div>

					{/* other fields */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Title</label>
						<Input
							value={newSong.title}
							onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
							className="bg-zinc-800 border-zinc-700"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Artist</label>
						<Input
							value={newSong.artist}
							onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
							className="bg-zinc-800 border-zinc-700"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Duration (seconds)</label>
						<Input
							type="number"
							min="0"
							value={newSong.duration}
							onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })}
							className="bg-zinc-800 border-zinc-700"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Album (Optional)</label>
						<Select
							value={newSong.albumId}
							onValueChange={(value) => setNewSong({ ...newSong, albumId: value })}
						>
							<SelectTrigger className="bg-zinc-800 border-zinc-700">
								<SelectValue placeholder="Select album" />
							</SelectTrigger>
							<SelectContent className="bg-zinc-800 border-zinc-700">
								<SelectItem value="none">No Album (Single)</SelectItem>
								{albums.map((album) => (
									<SelectItem key={album._id} value={album._id}>
										{album.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isLoading}>
						{isLoading ? "Uploading..." : "Add Song"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddSongDialog;
