require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Redis = require("redis");
const Pusher = require("pusher");
const http = require("http");
const { Server } = require("socket.io");

const sessionRoutes = require("./routes/sessionRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect().catch(console.error);

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

app.use((req, res, next) => {
  req.redisClient = redisClient;
  req.pusher = pusher;
  next();
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("playPause", (state) => {
    console.log("Play/Pause state changed:", state);
    socket.broadcast.emit("playPause", state);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use("/api/sessions", sessionRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
