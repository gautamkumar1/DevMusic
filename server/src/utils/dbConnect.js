
const mongoose = require('mongoose');

const URL = process.env.MONGO_URI;
const connectDb = async () => {
    try {
        await mongoose.connect(URL)
        console.log("Database connection successful");
    } catch (error) {
        console.error("Database connection is failed");
        console.log(error);
        
        process.exit(0);
    }
}

module.exports = connectDb;