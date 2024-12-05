const User = require("../models/auth-model");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const register = async (req, res) => {
    // console.log(`req.body: ${JSON.stringify(req.body)}`);
    
    try {
        const {username, email, password,bio,isBlocked,isAdmin,skills,linkedInLink,portfolioLink,githubLink} = req.body;
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
        
        const newUser = await User.create({username, email, password,bio,isBlocked,isAdmin,skills,profile_picture: profile_pictureUpload || 'https://via.placeholder.com/300x300',portfolioLink: portfolioLink || 'https://portfolio.com',githubLink: githubLink || 'https://github.com',linkedInLink: linkedInLink || 'https://linkedin.com'});
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
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }
        return res.status(200).json({message: "User fetched successfully", userData: user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
        
    }
}
// This is a admin route
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json({message: "All users fetched successfully", userData: users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
        
    }
}
module.exports = {register,login,getSingleUser,getAllUsers};