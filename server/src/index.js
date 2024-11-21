require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(morgan("dev"));

app.get("/", (req, res) => {    
    res.json({
        message: "Hello World"
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});