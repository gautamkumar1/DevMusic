const express = require("express");
const upload = require("../middleware/multer-middleware");
const { register, login } = require("../controllers/auth-controllers");
const router = express.Router();

router.post("/user/register",upload.fields([        {
    name: "profile_picture",
    maxCount: 1
}]),register)

router.post("/user/login", login);
module.exports = router;