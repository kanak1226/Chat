import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

import { sendMessage, getUnreadMessages, markAsRead } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protectRoute, sendMessage);
router.get("/unread", protectRoute, getUnreadMessages);
router.patch("/:id/read", protectRoute, markAsRead);

export default router;
