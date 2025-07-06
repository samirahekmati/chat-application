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

// DELETE a message by ID (only if it belongs to the user)
export const deleteMessage = async (req, res) => {
  const messageId = req.params.id;
  const currentUsername = req.user?.username; // comes from verifyToken


  console.log("DELETE request received for ID:", messageId);

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    console.log("User from token:", req.user.username);
    console.log("Message from DB:", message.username);

    // Check if the message belongs to the user
    if (message.username !== currentUsername) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await message.deleteOne();
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message" });
  }
};