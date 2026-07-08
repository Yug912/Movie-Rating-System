import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, trim: true, maxlength: 1600 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sentiment: {
      label: { type: String, enum: ["positive", "neutral", "negative"], default: "neutral" },
      score: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
