import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    ads_name: String,
    ads_category: String,
    ads_description: String,
    ads_price: Number,
    ads_photo: String,
    ads_rating: { type: Number, default: 0 },
    likedBy: {
      type: [String],
      default: [],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Virtuals for comments
adSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "ad",
});

adSchema.set("toObject", { virtuals: true });
adSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Ad", adSchema);
