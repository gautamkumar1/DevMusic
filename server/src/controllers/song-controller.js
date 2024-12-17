const song = require("../models/song-model");
const albumModel = require("../models/album-model");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const createSong = async (req, res) => {
    try {
    //   console.log(`Request Body: ${JSON.stringify(req.body)}`);
  
      const { title, artist, albumId, duration } = req.body;
  
      // Image URL handling
      let imageUrlPath;
      if (req.files && req.files.imageUrl && req.files.imageUrl[0]) {
        imageUrlPath = req.files.imageUrl[0].path;
      }
      console.log(`Image Path: ${imageUrlPath}`);
      const imageUrlUpload = imageUrlPath
        ? await uploadOnCloudinary(imageUrlPath)
        : null;
  
      // Audio URL handling
      let audioUrlPath;
      if (req.files && req.files.audioUrl && req.files.audioUrl[0]) {
        audioUrlPath = req.files.audioUrl[0].path;
      }
      console.log(`Audio Path: ${audioUrlPath}`);
      const audioUrlPathUpload = audioUrlPath
        ? await uploadOnCloudinary(audioUrlPath)
        : null;
  
      console.log("Image URL Upload:", imageUrlUpload);
      console.log("Audio URL Upload:", audioUrlPathUpload);
  
      // Create the song document
      const songCreated = await song.create({
        title,
        artist,
        audioUrl: audioUrlPathUpload,
        imageUrl: imageUrlUpload,
        duration,
        albumId: albumId || null,
      });
  
      // Fetch the complete saved document
      const fullSong = await song.findById(songCreated._id);
      console.log("Full Saved Song:", fullSong);
  
      // Update album if albumId is provided
      if (albumId) {
        await albumModel.findByIdAndUpdate(albumId, {
          $push: { songs: songCreated._id },
        });
      }
  
      return res.status(201).json({
        message: "Song created successfully",
        songData: fullSong,
      });
    } catch (error) {
      console.error("Error in createSong:", error);
      return res.status(500).json({ message: error.message });
    }
  };
  
const deleteSong = async (req, res) => {
    try {
        const {songId} = req.body;
        const isSongDeleted = await song.findByIdAndDelete(songId);
        if(!isSongDeleted){
            return res.status(404).json({message: "Song not found"});
        }
        res.status(200).json({message: "Song deleted successfully"});
    } catch (error) {
        console.log("Error in deleteSong", error);
        return res.status(500).json({message: error.message});
        
    }
};

const allSongs = async (req, res) => {
    try {
        // -1 = Descending => newest -> oldest
		// 1 = Ascending => oldest -> newest
		const allSong = await song.find().sort({ createdAt: -1 });
        if(!allSong){
            return res.status(404).json({message: "Song not found"});
        }
        const totalSongs = allSong.length;
        res.status(200).json({totalSongs: totalSongs, allSong: allSong});
    } catch (error) {
        console.log("Error in allSongs", error);
        return res.status(500).json({message: error.message});
    }
}
const getSongsByAlbum = async (req, res) => {
  try {
    const {albumId} = req.params;
    const allSong = await song.find({albumId}).sort({ createdAt: -1 });
    if(!allSong){
        return res.status(404).json({message: "Song not found for this album"});
    }
    const totalSongsInThisAlbum = allSong.length;
    res.status(200).json({totalSongsInThisAlbum: totalSongsInThisAlbum, allSong: allSong});
  } catch (error) {
    
  }
}
module.exports = { createSong,deleteSong,allSongs,getSongsByAlbum };
