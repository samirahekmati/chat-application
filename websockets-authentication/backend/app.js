import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messagesRoute.js";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";
import Message from './models/message.js';



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

app.use("/api/messages", messageRoutes);

app.get("/test", (req, res) => {
    res.send("Server and DB are working working");
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
  socket.on("message", async (msg) => {
    try {
      // Create new message document
      const message = new Message({
        username: msg.username,
        text: msg.text,
        timestamp: new Date(),
      });

      // Save message to DB
      const savedMessage = await message.save();

      // Broadcast saved message (including DB-generated fields like _id, timestamp)
      io.emit("message", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});