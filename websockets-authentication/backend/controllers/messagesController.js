// controllers/messagesController.js
import Message from "../models/message.js";

// GET all messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get messages" });
  }
};

// POST a new message
export const createMessage = async (req, res) => {
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
};