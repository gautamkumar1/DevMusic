const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String,
    },
    bio:{
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    skills:{
        type: [String],
    },
    role:{
        type: String,
    },
    githubLink:{
        type: String
    },
    linkedInLink:{
        type: String
    },
    portfolioLink:{
        type: String
    }
    
},
{timestamps: true}
)

userSchema.pre("save", function(next) {
    if (this.isModified("password")) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateToken = function () {
    const payload = { id: this._id, email: this.email,username: this.username };
    const secret = process.env.JWT_SECRET; 
    // console.log(`secret: ${secret}`);
    
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });
    return token;
  }

module.exports = mongoose.model("User", userSchema);