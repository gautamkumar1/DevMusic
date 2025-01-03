const express = require("express");
const { isAuthenticated, isAuthorized } = require("../middleware/auth-middleware");
const { createSong, allSongs, deleteSong, getSongsByAlbum, deleteSongByAlbumId } = require("../controllers/song-controller");
const upload = require("../middleware/multer-middleware");
const router = express.Router();

router.post("/admin/songCreate",isAuthenticated,isAuthorized,upload.fields([{
    name: "audioUrl",
    maxCount: 100
},
{
    name: "imageUrl",
    maxCount: 10
}
]),createSong)

router.delete("/admin/songDelete",isAuthenticated,isAuthorized,deleteSong)
router.delete("/admin/songDeleteByAlbumId",isAuthenticated,isAuthorized,deleteSongByAlbumId)
router.get("/songs",isAuthenticated,allSongs)
router.get("/getSongsByAlbum/:albumId",isAuthenticated,getSongsByAlbum)
module.exports = router;