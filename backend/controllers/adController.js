import Ad from "../models/Ad.js";

export const getAdWithComments = async (req, res) => {
  try {
    const adId = req.params.id;

    const ad = await Ad.findById(adId)
      .populate("postedBy", "userName")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "userName",
        },
      });

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      postedBy: req.user._id, // assumes user is authenticated
    });

    const savedAd = await newAd.save();
    res.status(201).json(savedAd);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
