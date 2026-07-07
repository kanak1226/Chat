import express from "express";
import { getFriends, acceptRequest } from "../controllers/friendController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/friends
router.get("/", protectRoute, getFriends);

// PUT /api/friend-request/:id/accept
router.put("/friend-request/:id/accept", protectRoute, acceptRequest);

export default router;
