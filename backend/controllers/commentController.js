// controllers/commentController.js
import Comment from "../models/Comment.js";
import Ad from "../models/Ad.js";

export const createComment = async (req, res) => {
  try {
    const { text, adId } = req.body;

    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    const comment = new Comment({
      text,
      ad: adId,
      user: req.user._id, // user comes from token
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
