import express from "express";
import Message from "../models/message.js";

const router = express.Router();

// GET /api/messages - fetch all previous messages (or you can paginate later)
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }); // oldest first
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get messages" });
  }
});

// POST /api/messages - save a new message
router.post("/", async (req, res) => {
  const { username, text } = req.body;

  if (!username || !text) {
    return res.status(400).json({ message: "Username and text are required" });
  }

  try {
    const newMessage = new Message({ username, text });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to save message" });
  }
});

export default router;