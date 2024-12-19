const express = require("express");
const { isAuthenticated, isAuthorized } = require("../middleware/auth-middleware");
const { createAlbum, deleteAlbum, getAllAlbums, getAlbumById } = require("../controllers/album-controller");
const upload = require("../middleware/multer-middleware");
const router = express.Router();

router.post("/admin/albumCreate",isAuthenticated,isAuthorized,upload.fields([        {
    name: "imageUrl",
    maxCount: 1
}]),createAlbum)
router.delete("/admin/albumDelete",isAuthenticated,isAuthorized,deleteAlbum)
router.get("/albums",getAllAlbums)
router.get("/getAlbumById/:albumId",isAuthenticated,getAlbumById)
module.exports = router;