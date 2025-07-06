import express from "express";
import { getAllMessages, createMessage, deleteMessage } from "../controllers/messagesController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllMessages);
router.post("/", createMessage);
router.delete("/:id", verifyToken, deleteMessage);

export default router;