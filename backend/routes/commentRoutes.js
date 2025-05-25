// routes/commentRoutes.js
import express from "express";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createComment);
router.put("/:id", authenticateToken, updateComment);
router.delete("/:id", authenticateToken, deleteComment);
export default router;
