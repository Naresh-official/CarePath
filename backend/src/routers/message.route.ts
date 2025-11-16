import { Router } from "express";
import {
	sendMessage,
	getConversation,
	getAllConversations,
	markAsRead,
	deleteMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.post("/send", sendMessage);
router.get("/conversation/:userId", getConversation);
router.get("/conversations", getAllConversations);
router.patch("/mark-read/:messageId", markAsRead);
router.delete("/message/:messageId", deleteMessage);

export default router;
