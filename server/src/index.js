require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require("morgan");
const connectDb = require('./utils/dbConnect');
const authRoutes = require("./routes/auth-routes");
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {    
    res.json({
        message: "Hello World"
    });
});
app.use("/api", authRoutes);
const PORT = process.env.PORT || 3000;

connectDb().then(() => app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)));