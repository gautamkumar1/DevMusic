const song = require("../models/song-model");
const albumModel = require("../models/album-model");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const NodeCache = require("node-cache");
const { getAllStatsKey, getAllSongsKey, getAllAlbumsKey } = require("../cacheKey/cacheKey");
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // TTL of 1 hour

const createSong = async (req, res) => {
    try {
    //   console.log(`Request Body: ${JSON.stringify(req.body)}`);
    
      const { title, artist, albumId, duration } = req.body;
      
      const cacheKey1 = getAllSongsKey;
      cache.del(cacheKey1);
      const cacheKey2 = `songsByAlbum_${albumId}`;
      cache.del(cacheKey2);
      const cacheKey3 = getAllStatsKey;
      cache.del(cacheKey3);
      const cacheKey4 = getAllAlbumsKey;
      cache.del(cacheKey4);

      const existingSong = await song.findOne({ title, artist });
      if (existingSong) {
        return res.status(400).json({
          message: `Song with title "${title}" and artist "${artist}" already exists in the database.`,
        });
      }

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
  
      // console.log("Image URL Upload:", imageUrlUpload);
      // console.log("Audio URL Upload:", audioUrlPathUpload);

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
      // console.log("Full Saved Song:", fullSong);
  
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
      const { songId } = req.body;

      // Delete the song from the Song collection
      const isSongDeleted = await song.findByIdAndDelete(songId);
      if (!isSongDeleted) {
          return res.status(404).json({ message: "Song not found" });
      }
      const cacheKey1 = getAllSongsKey;
      cache.del(cacheKey1);
      const cacheKey2 = "songsByAlbum";
      cache.del(cacheKey2);
      // Remove the songId from the `songs` array in all associated albums
      await albumModel.updateMany(
          { songs: songId }, // Find albums with the songId in their `songs` array
          { $pull: { songs: songId } } // Remove the songId from the `songs` array
      );

      res.status(200).json({ message: "Song deleted successfully and removed from albums" });
  } catch (error) {
      console.log("Error in deleteSong", error);
      return res.status(500).json({ message: error.message });
  }
};

const allSongs = async (req, res) => {
    try {
        // -1 = Descending => newest -> oldest
		// 1 = Ascending => oldest -> newest
    const cacheKey = getAllSongsKey;
    const cachedData = cache.get(cacheKey);
    if(cachedData){
      // console.log("Returning from cache");
        return res.status(200).json({success: "Returning from cache", totalSongs: cachedData.totalSongs,allSong: cachedData.allSong});
    }

    // console.log("Returning from database");
		const allSong = await song.find().sort({ createdAt: -1 });
        if(!allSong){
            return res.status(404).json({message: "Song not found"});
        }
        const songsObject = allSong.map(song => song.toObject());
        const totalSongs = allSong.length;
        cache.set(cacheKey, {totalSongs: totalSongs, allSong: songsObject});
        res.status(200).json({totalSongs: totalSongs, allSong: songsObject});
    } catch (error) {
        console.log("Error in allSongs", error);
        return res.status(500).json({message: error.message});
    }
}
const getSongsByAlbum = async (req, res) => {
  try {
    
    const {albumId} = req.params;
    const cacheKey = `songsByAlbum_${albumId}`;
    const cachedData = cache.get(cacheKey);
    if(cachedData){
      // console.log("Returning from cache");
        return res.status(200).json({success: "Returning from cache", totalSongsInThisAlbum: cachedData.totalSongsInThisAlbum,allSong: cachedData.allSong});
    }
    const allSong = await song.find({albumId}).sort({ createdAt: -1 });
    if(!allSong){
        return res.status(404).json({message: "Song not found for this album"});
    }
    // console.log("Returning from database");
    const totalSongsInThisAlbum = allSong.length; 
    const songsObject = allSong.map(song => song.toObject());
    cache.set(cacheKey, {totalSongsInThisAlbum: totalSongsInThisAlbum, allSong: songsObject});
    res.status(200).json({totalSongsInThisAlbum: totalSongsInThisAlbum, allSong: songsObject});
  } catch (error) {
    
  }
}

const deleteSongByAlbumId = async (req, res) => {
  try {
    const { albumId } = req.body;

    if (!albumId) {
      return res.status(400).json({ message: "Album ID is required" });
    }
    const cacheKey1 = getAllSongsKey;
      cache.del(cacheKey1);
      const cacheKey2 = `songsByAlbum_${albumId}`;
      cache.del(cacheKey2);
    const isDeleted = await song.deleteMany({ albumId });

    if (isDeleted.deletedCount > 0) {
      return res.status(200).json({ message: `${isDeleted.deletedCount} song(s) deleted successfully` });
    } else {
      return res.status(404).json({ message: "No songs found for the given Album ID" });
    }
  } catch (error) {
    console.error("Error deleting song:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { createSong,deleteSong,allSongs,getSongsByAlbum,deleteSongByAlbumId };
