import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";



dotenv.config();
const app = express();
const PORT = 3000;

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);



app.get("/test", (req, res) => {
    res.send("Server is working");
  });

// Create HTTP server & bind Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Listen for incoming chat messages from clients
  socket.on("message", (msg) => {
    // Broadcast received message to all connected clients
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});