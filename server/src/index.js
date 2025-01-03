require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { createServer } = require("http");
const connectDb = require("./utils/dbConnect");
const initializeSocket = require("./socket/socket");

const authRoutes = require("./routes/auth-routes");
const albumRoutes = require("./routes/album-routes");
const songRoutes = require("./routes/song-routes");
const featuredRoutes = require("./routes/featured-routes");
const SingingActivityRoutes = require("./routes/SingingActivityRoutes");
const app = express();
const socketServer = createServer(app);

// Initialize Socket.IO
initializeSocket(socketServer);

// Middleware
app.use(
  cors({
    origin: "https://dev-musiic.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});
app.use("/api", authRoutes);
app.use("/api", albumRoutes);
app.use("/api", songRoutes);
app.use("/api", featuredRoutes);
app.use("/api", SingingActivityRoutes);
const keepAlive = () => {
  const url = 'https://devmusic-backend.onrender.com';
  setInterval(async () => {
    try {
      const response = await fetch(url);
      console.log('Keep-alive ping sent, status:', response.status);
    } catch (error) {
      console.error('Keep-alive ping failed:', error);
    }
  }, 840000); // 14 minutes
}
const PORT = process.env.PORT || 3001;
keepAlive();
// Start Server
connectDb().then(() => {
  socketServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
