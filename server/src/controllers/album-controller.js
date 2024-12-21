const albumModel = require("../models/album-model");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // TTL of 1 hour
const createAlbum = async (req, res) => {
    try {
        console.log(`req.body: ${JSON.stringify(req.body)}`);
        const { title, artist, releaseYear,language } = req.body;
        let imageUrlPath;

        if (
          req.files &&
          Array.isArray(req.files.imageUrl) &&
          req.files.imageUrl.length > 0
        ) {
            imageUrlPath = req.files.imageUrl[0].path;
        }
        console.log(`imageUrlPath: ${imageUrlPath}`);
        const imageUrlUpload = await uploadOnCloudinary(imageUrlPath);
        const cacheKey1 = "allAlbums";
        cache.del(cacheKey1);
        const cacheKey2 = `album:${albumId}`;
        cache.del(cacheKey2);
        const album = await albumModel.create({
            title,
            artist,
            imageUrl:imageUrlUpload,
            releaseYear,
            language
        });
        if (!album) {
            return res.status(400).json({ message: "Album not created" });
        }
        
        return res.status(201).json({
            message: "Album created successfully", 
            alubmData: album
        });
    } catch (error) {
        console.log("Error in createAlbum", error);
        
    }
};

const deleteAlbum = async (req, res) => {
    try {
        const { albumId } = req.body;
        const cacheKey1 = "allAlbums";
        cache.del(cacheKey1);
        const cacheKey2 = `album:${albumId}`;
        cache.del(cacheKey2);
        const album = await albumModel.findByIdAndDelete(albumId);
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }
        res.status(200).json({ message: "Album deleted successfully" });
    } catch (error) {
        console.log("Error in deleteAlbum", error);
    }
};
const getAllAlbums = async (req, res) => {
    try {
        const cacheKey = "allAlbums";

        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log("Returning from cache");
            return res.status(200).json({
                totalAlbums: cachedData.totalAlbums,
                albums: cachedData.albums 
            });
        }

        console.log("Returning from database");
        const albums = await albumModel.find();
        const totalAlbums = albums.length;
        const albumObject = albums.map(album => album.toObject());
        cache.set(cacheKey, { totalAlbums, albums: albumObject });
        res.status(200).json({
            totalAlbums: totalAlbums,
            albums: albumObject
        });
    } catch (error) {
        console.error("Error in getAllAlbums", error);
        return res.status(500).json({ message: error.message });
    }
};

const getAlbumById = async (req, res) => {
    try {
      const {albumId} = req.params;
      const cacheKey = `album:${albumId}`;
      const cachedAlbum = cache.get(cacheKey);
      if(cachedAlbum){
        console.log("Returning from cache");
        return res.status(200).json({album: cachedAlbum});
      }
      const album = await albumModel.findById(albumId);
      if(!album){
          return res.status(404).json({message: "Album not found"});
      }
      console.log("Returning from database");
      const albumObject = album.toObject(); 
      cache.set(cacheKey, albumObject);
      res.status(200).json({album: albumObject});
    } catch (error) {
      console.log("Error in getAlbumById", error);
      return res.status(500).json({message: error.message});
    }
}
module.exports = { createAlbum, deleteAlbum,getAllAlbums,getAlbumById };