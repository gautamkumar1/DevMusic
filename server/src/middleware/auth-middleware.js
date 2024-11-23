
const jwt = require("jsonwebtoken");
const User = require("../models/auth-model");
const isAuthenticated = async (req, res, next) => {
    
    const authHeader = req.headers["authorization"];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided, user not authenticated!" });
    }
    const token = authHeader.split(" ")[1];
    

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(`decoded: ${JSON.stringify(decoded)}`);
        
        
        req.user = await User.findById(decoded.id);
        

        
        if (!req.user) {
            return res.status(404).json({ message: "User not found!" });
        }

        
        req.user.isAdmin = req.user.isAdmin || false;

        next();
    } catch (error) {
       
        return res.status(401).json({ message: "Invalid or expired token!" });
    }
};


const isAuthorized = (req, res, next) => {
    
    if (!req.user) {
        return res.status(403).json({ message: "Not authenticated!" });
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin privileges required!" });
    }

    
    next();
};



module.exports = { isAuthenticated, isAuthorized };