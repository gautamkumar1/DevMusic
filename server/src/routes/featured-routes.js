const express = require("express");
const { getFeaturedSongs, getFeaturedAlbums } = require("../Featured/featured-songs-albums");
const router = express.Router();

router.get("/featured/songs", getFeaturedSongs);
router.get("/featured/albums", getFeaturedAlbums);

module.exports = router