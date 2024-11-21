const multer = require('multer');
const path = require('path'); 
const fs = require('fs'); 


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
  }
})



const upload = multer({
  storage,
});


module.exports = upload;