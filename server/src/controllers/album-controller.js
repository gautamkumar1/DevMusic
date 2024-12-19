const albumModel = require("../models/album-model");
const { uploadOnCloudinary } = require("../utils/cloudinary");

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
		const albums = await albumModel.find();
        const totalAlbums = albums.length;
		res.status(200).json({totalAlbums:totalAlbums,albums:albums});
	} catch (error) {
        console.log("Error in getAllAlbums", error);
        return res.status(500).json({ message: error.message });
	}
};
const getAlbumById = async (req, res) => {
    try {
      const {albumId} = req.params;
      const album = await albumModel.findById(albumId);
      if(!album){
          return res.status(404).json({message: "Album not found"});
      }
      res.status(200).json({album: album});
    } catch (error) {
      console.log("Error in getAlbumById", error);
      return res.status(500).json({message: error.message});
    }
  }
module.exports = { createAlbum, deleteAlbum,getAllAlbums,getAlbumById };