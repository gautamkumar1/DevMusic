const express = require("express");
const upload = require("../middleware/multer-middleware");
const { register, login, getSingleUser, getAllUsers, getMessage, getStats, updateProfile } = require("../controllers/auth-controllers");
const { isAuthenticated, isAuthorized } = require("../middleware/auth-middleware");
const router = express.Router();

router.post("/user/register",upload.fields([        {
    name: "profile_picture",
    maxCount: 1
}]),register)
router.put("/updateProfile/:userId",upload.fields([        {
    name: "profile_picture",
    maxCount: 1
}]),updateProfile)

router.post("/user/login", login);
router.get("/user/:userId",getSingleUser)
router.get("/allUsers",isAuthenticated,getAllUsers)
router.get("/users/messages/:userId",isAuthenticated,getMessage)
router.get("/getallstats",isAuthenticated,getStats)
module.exports = router;