const express = require("express");
const upload = require("../middleware/multer-middleware");
const { register, login, getSingleUser, getAllUsers } = require("../controllers/auth-controllers");
const { isAuthenticated, isAuthorized } = require("../middleware/auth-middleware");
const router = express.Router();

router.post("/user/register",upload.fields([        {
    name: "profile_picture",
    maxCount: 1
}]),register)

router.post("/user/login", login);
router.get("/user/:userId",isAuthenticated,getSingleUser)
router.get("/allUsers",isAuthenticated,getAllUsers)
module.exports = router;