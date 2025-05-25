import express from "express";
import {
  getAdWithComments,
  createAd,
  updateAd,
  deleteAd,
  getAllAds,
  toggleLikeAd,
} from "../controllers/adController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/:id", getAdWithComments);
router.get("/", getAllAds);
router.post("/", authenticateToken, createAd);
router.put("/:id", authenticateToken, updateAd);
router.put("/:id/like", authenticateToken, toggleLikeAd);
router.delete("/:id", authenticateToken, deleteAd);
export default router;
