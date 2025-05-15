import express from "express";
import { getAdWithComments, createAd } from "../controllers/adController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// GET /ads/:id → full ad with postedBy and comments
router.get("/:id", getAdWithComments);
router.post("/", authenticateToken, createAd);
export default router;
