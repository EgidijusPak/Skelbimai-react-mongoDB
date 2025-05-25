import Ad from "../models/Ad.js";
import mongoose from "mongoose";

export const getAdWithComments = async (req, res) => {
  try {
    const adId = req.params.id;
    const ad = await Ad.findById(adId)
      .populate("postedBy", "userName")
      .populate({
        path: "comments",
        populate: { path: "user", select: "userName" },
      });
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find()
      .populate("postedBy", "userName")
      .populate({
        path: "comments",
        populate: { path: "user", select: "userName" },
      });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAd = async (req, res) => {
  try {
    const { ads_name, ads_category, ads_description, ads_price, ads_photo } =
      req.body;
    const newAd = new Ad({
      ads_name,
      ads_category,
      ads_description,
      ads_price,
      ads_photo,
      postedBy: req.user._id,
    });
    const savedAd = await newAd.save();
    res.status(201).json(savedAd);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAd = async (req, res) => {
  try {
    const adId = req.params.id;
    const updates = req.body;

    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // Debug logs
    console.log("req.user._id:", req.user._id);
    console.log("ad.postedBy:", ad.postedBy);
    console.log("req.user.role:", req.user.role);

    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Authorization check: owner or admin
    if (!ad.postedBy.equals(userId) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this ad" });
    }

    // Update fields
    Object.keys(updates).forEach((key) => {
      ad[key] = updates[key];
    });

    const updatedAd = await ad.save();
    res.json(updatedAd);
  } catch (err) {
    console.error("Update Ad error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const adId = req.params.id;
    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // Debug logs
    console.log("req.user._id:", req.user._id);
    console.log("ad.postedBy:", ad.postedBy);
    console.log("req.user.role:", req.user.role);

    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Authorization check: owner or admin
    if (!ad.postedBy.equals(userId) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this ad" });
    }

    await ad.deleteOne();
    res.json({ message: "Ad deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleLikeAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    const userId = req.user._id.toString();

    const alreadyLiked = ad.likedBy.includes(userId);
    if (alreadyLiked) {
      ad.likedBy = ad.likedBy.filter((id) => id !== userId);
    } else {
      ad.likedBy.push(userId);
    }

    const updatedAd = await ad.save();
    res.json(updatedAd);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
