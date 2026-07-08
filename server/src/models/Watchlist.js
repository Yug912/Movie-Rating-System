import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    status: { type: String, enum: ["watching", "planned", "watched"], default: "planned" },
    watchedAt: { type: Date }
  },
  { timestamps: true }
);

watchlistSchema.index({ user: 1, movie: 1 }, { unique: true });

export default mongoose.model("Watchlist", watchlistSchema);
