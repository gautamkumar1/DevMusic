const express = require("express");
const { isAuthenticated, isAuthorized } = require("../middleware/auth-middleware");
const { createSong, allSongs, deleteSong } = require("../controllers/song-controller");
const upload = require("../middleware/multer-middleware");
const router = express.Router();

router.post("/admin/songCreate",isAuthenticated,isAuthorized,upload.fields([{
    name: "audioUrl",
    maxCount: 1
},
{
    name: "imageUrl",
    maxCount: 1
}
]),createSong)

router.delete("/admin/songDelete/:songId",isAuthenticated,isAuthorized,deleteSong)
router.get("/songs",isAuthenticated,allSongs)
module.exports = router;