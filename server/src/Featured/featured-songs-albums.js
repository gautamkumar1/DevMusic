const Song = require("../models/song-model");
const Album = require("../models/album-model");
const getFeaturedSongs = async (req, res) => {
	try {
		// fetch 6 random songs using mongodb's aggregation pipeline
		const songs = await Song.aggregate([
			{
				$sample: { size: 3 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		console.log("Error in getFeaturedSongs", error);
        return res.status(500).json({ message: error.message });
        
	}
};
const getFeaturedAlbums = async (req, res) => {
	try {
		// fetch 6 random songs using mongodb's aggregation pipeline
		const albums = await Album.aggregate([
			{
				$sample: { size: 3 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
					language: 1,
					releaseYear: 1,
					songs: 1,
				},
			},
		]);

		res.json(albums);
	} catch (error) {
		console.log("Error in getFeaturedAlbums", error);
        return res.status(500).json({ message: error.message });
        
	}
};

module.exports = { getFeaturedSongs, getFeaturedAlbums };