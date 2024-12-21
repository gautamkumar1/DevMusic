const User = require("../models/auth-model");
const Message = require("../models/message-model")
const Song = require("../models/song-model")
const Album = require("../models/album-model")
const { uploadOnCloudinary } = require("../utils/cloudinary");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // TTL of 1 hour
const register = async (req, res) => {
    // console.log(`req.body: ${JSON.stringify(req.body)}`);
    
    try {
        const {username, email, password,bio,isBlocked,isAdmin,skills,linkedInLink,portfolioLink,githubLink,role} = req.body;
        if(username.length < 3){
            return res.status(400).json({message: "Username must be at least 3 characters"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        if(email.length < 3){
            return res.status(400).json({message: "Email must be at least 3 characters"});
        }
        if(!email.includes("@") || !email.includes(".")){
            return res.status(400).json({message: "Invalid email"});
        }
        if(!username || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        const isUserExist = await User.findOne({email});
        if(isUserExist){
            return res.status(400).json({message: "User already exist"});
        }
        let profile_picturePath;

        if (
          req.files &&
          Array.isArray(req.files.profile_picture) &&
          req.files.profile_picture.length > 0
        ) {
            profile_picturePath = req.files.profile_picture[0].path;
        }
        console.log(`profile_picturePath: ${profile_picturePath}`);
        const profile_pictureUpload = await uploadOnCloudinary(profile_picturePath);
        const cacheKey = "allUsers";
        cache.del(cacheKey);
        const cacheKey2 = "stats";
        cache.del(cacheKey2);
        const newUser = await User.create({username, email, password,bio,isBlocked,isAdmin,role,skills,profile_picture: profile_pictureUpload || 'https://via.placeholder.com/300x300',portfolioLink: portfolioLink || 'https://portfolio.com',githubLink: githubLink || 'https://github.com',linkedInLink: linkedInLink || 'https://linkedin.com'});
        const jwtToken = await newUser.generateToken();
        return res.status(200).json({message: "Registered successfully", userData: newUser, token: jwtToken});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

const login = async (req, res) => {
    try {
        console.log(req.body);
        
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch){
            return res.status(400).json({message: "Invalid password"});
        }
        const jwtToken = await user.generateToken();
        return res.status(200).json({message: "Logged in successfully", userData: user, token: jwtToken});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

const getSingleUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const cacheKey = `user-${userId}`;
        const cachedData = cache.get(cacheKey);
        if(cachedData){
            console.log("Returning from cache");
            return res.status(200).json({message: "User fetched successfully", userData: cachedData});
        }
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }
        console.log("Returning from database");
        const userObject = user.toObject();
        cache.set(cacheKey, userObject);
        return res.status(200).json({message: "User fetched successfully", userData: userObject});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
        
    }
}
// This is a admin route
const getAllUsers = async (req, res) => {
    try {
        const cacheKey = "allUsers";
        const cachedData = cache.get(cacheKey);
        if(cachedData){ 
            console.log("Returning from cache");
            return res.status(200).json({message: "All users fetched successfully", totalUsers: cachedData.totalUsers, userData: cachedData.userData});
        }
        const users = await User.find().select("-password");
        const totalUsers = users.length;
        const usersObject = users.map(user => user.toObject());
        cache.set(cacheKey, {totalUsers: totalUsers, userData: usersObject});
        console.log("Returning from database");
        return res.status(200).json({message: "All users fetched successfully", totalUsers: totalUsers, userData: usersObject});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
        
    }
}

const getMessage = async (req, res) => {
    try {
        const myId = req.user.id;
        const {userId} = req.params;
        const cacheKey = `messages-${myId}-${userId}`;
        const cachedData = cache.get(cacheKey);
        if(cachedData){
            console.log("Returning from cache");
            return res.status(200).json({message: "Messages fetched successfully", messages: cachedData});
        }
		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });
        console.log("Returning from database");
        const messagesObject = messages.map(message => message.toObject()); 
        cache.set(cacheKey, messagesObject);
        return res.status(200).json({message: "Messages fetched successfully", messages: messagesObject});
    } catch (error) {
        console.log(`Error in getMessage: ${error}`);
        return res.status(500).json({message: error.message});
        
    }
}

const getStats = async (req, res) => {
    try {
        const cacheKey = "stats";
        const cachedData = cache.get(cacheKey);
        if(cachedData){
            console.log("Returning from cache");
            return res.status(200).json({message: "Stats fetched successfully", totalUsers: cachedData.totalUsers, totalSongs: cachedData.totalSongs, totalAlbums: cachedData.totalAlbums});
        }
        const users = await User.find();
        const totalUsers = users.length;
        const songs = await Song.find();
        const totalSongs = songs.length;
        const albums = await Album.find();
        const totalAlbums = albums.length;
        cache.set(cacheKey, {totalUsers: totalUsers, totalSongs: totalSongs, totalAlbums: totalAlbums});
        console.log("Returning from database");
        return res.status(200).json({totalUsers: totalUsers, totalSongs: totalSongs, totalAlbums: totalAlbums});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}
module.exports = {register,login,getSingleUser,getAllUsers,getMessage,getStats};