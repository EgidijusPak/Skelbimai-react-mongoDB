import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getAllUsers); // admin only
router.get("/:id", authenticateToken, getUserById); // user or admin
router.put("/:id", authenticateToken, updateUser); // user only
router.delete("/:id", authenticateToken, deleteUser); // admin only

export default router;
