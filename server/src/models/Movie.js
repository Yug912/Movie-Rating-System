import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    genre: [{ type: String, required: true, trim: true, index: true }],
    poster: { type: String, required: true },
    backdrop: { type: String },
    description: { type: String, required: true },
    releaseYear: { type: Number },
    runtime: { type: Number },
    director: { type: String },
    cast: [{ type: String }],
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    externalIds: {
      tmdb: String,
      imdb: String
    }
  },
  { timestamps: true }
);

movieSchema.index({ title: "text", description: "text", genre: "text", director: "text", cast: "text" });

export default mongoose.model("Movie", movieSchema);
