// routes/commentRoutes.js
import express from "express";
import { createComment } from "../controllers/commentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createComment);

export default router;
