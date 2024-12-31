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

    const [songs, setSongs] = useState<NewSong[]>([]);
    const [files, setFiles] = useState<{
        audioFiles: File[];
        imageFiles: File[];
    }>({
        audioFiles: [],
        imageFiles: [],
    });

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Extract metadata from the audio file
    const extractMetadata = async (audioFile: File) => {
        // console.log("Extracting metadata from audio file:", audioFile.name);

        try {
            const metadata = await mm.parseBlob(audioFile);
            // console.log("Extracted Metadata:", metadata);

            const title = metadata.common.title || "Unknown Title";
            const artist = metadata.common.artist || "Unknown Artist";
            const duration = metadata.format.duration || 0; // duration in seconds
            const newSong: NewSong = {
                title,
                artist,
                albumId: "",
                duration: Math.floor(duration).toString(),
            };

            setSongs((prev) => [...prev, newSong]);

            // Extract and set the image (album artwork)
            if (metadata.common.picture && metadata.common.picture.length > 0) {
                const picture = metadata.common.picture[0]; // Use the first image
                const blob = new Blob([picture.data], { type: picture.format });
                const file = new File([blob], "album-artwork.jpg", { type: picture.format });

                setFiles((prev) => ({
                    ...prev,
                    imageFiles: [...prev.imageFiles, file],
                }));

                toast.success(`Metadata extracted successfully for ${title}, including album artwork!`);
            } else {
                toast.info(`Metadata extracted successfully for ${title}, but no album artwork found.`);
            }
        } catch (error) {
            toast.error("Failed to extract metadata");
            console.error("Error extracting metadata:", error);
        }
    };

    const handleAudioFileChange = (fileList: FileList | null) => {
        if (fileList) {
            const selectedFiles = Array.from(fileList);
            setFiles((prev) => ({
                ...prev,
                audioFiles: [...prev.audioFiles, ...selectedFiles],
            }));

            // Extract metadata for each selected file
            selectedFiles.forEach((file) => extractMetadata(file));
        } else {
            toast.error("No audio files selected");
        }
    };

    const handleImageFileChange = (fileList: FileList | null) => {
        if (fileList) {
            const selectedFiles = Array.from(fileList);
            setFiles((prev) => ({
                ...prev,
                imageFiles: [...prev.imageFiles, ...selectedFiles],
            }));
        } else {
            toast.error("No image files selected");
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!files.audioFiles[0] || !files.imageFiles[0]) {
                toast.error("Please upload both audio and image files");
                return;
            }
     
            const formData = new FormData();
            formData.append("title", songs[0].title || "Untitled");
            formData.append("artist", songs[0].artist || "Unknown Artist");
            formData.append("duration", songs[0].duration);
            if (songs[0].albumId && songs[0].albumId !== "none") {
                formData.append("albumId", songs[0].albumId);
            }
            formData.append("audioUrl", files.audioFiles[0]);
            formData.append("imageUrl", files.imageFiles[0]);
     
            const response = await fetch("/api/admin/songCreate", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
     
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
     
            toast.success(`Song ${songs[0].title} added successfully`);
            setFiles({ audioFiles: [], imageFiles: [] });
            setSongs([]);
            setSongDialogOpen(false);
            
        } catch (error:any) {
            toast.error(error.message || "Failed to add song");
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
                        multiple
                        onChange={(e) => handleAudioFileChange(e.target.files)}
                    />
                    <input
                        type="file"
                        ref={imageInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageFileChange(e.target.files)}
                    />

                    <div
                        className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <div className="text-center">
                            {files.imageFiles.length > 0 ? (
                                <img
                                    src={URL.createObjectURL(files.imageFiles[0])}
                                    alt="Selected Album Artwork"
                                    className="h-32 w-32 object-cover rounded-lg mx-auto"
                                />
                            ) : (
                                <>
                                    <Upload className="h-6 w-6 text-zinc-400" />
                                    <div className="text-sm text-zinc-400">Upload artwork</div>
                                    <Button variant="outline" size="sm" className="text-xs">
                                        Choose File
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Audio Files</label>
                        <Button variant="outline" onClick={() => audioInputRef.current?.click()} className="w-full">
                            {files.audioFiles.length > 0
                                ? `${files.audioFiles.length} file(s) selected`
                                : "Choose Audio Files"}
                        </Button>
                    </div>

					{songs.map((song, index) => (
    <div key={song.title || song.artist || song.duration || index} className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
            value={song.title}
            onChange={(e) =>
                setSongs((prev) =>
                    prev.map((s, i) =>
                        i === index ? { ...s, title: e.target.value } : s
                    )
                )
            }
            className="bg-zinc-800 border-zinc-700"
        />
        <label className="text-sm font-medium">Artist</label>
        <Input
            value={song.artist}
            onChange={(e) =>
                setSongs((prev) =>
                    prev.map((s, i) =>
                        i === index ? { ...s, artist: e.target.value } : s
                    )
                )
            }
            className="bg-zinc-800 border-zinc-700"
        />
        <label className="text-sm font-medium">Duration</label>
        <Input
            value={song.duration}
            onChange={(e) =>
                setSongs((prev) =>
                    prev.map((s, i) =>
                        i === index ? { ...s, duration: e.target.value } : s
                    )
                )
            }
            className="bg-zinc-800 border-zinc-700"
        />
        <label className="text-sm font-medium">Album</label>
        <Select
            value={song.albumId}
            onValueChange={(value) =>
                setSongs((prev) =>
                    prev.map((s, i) =>
                        i === index ? { ...s, albumId: value } : s
                    )
                )
            }
        >
            <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select album" />
            </SelectTrigger>
            <SelectContent>
                {albums.map((album) => (
                    <SelectItem key={album._id} value={album._id}>
                        {album.title}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
))}

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Uploading..." : "Add Songs"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddSongDialog;
