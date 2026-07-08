import mongoose from "mongoose";
import Review from "../models/Review.js";
import { estimateSentiment, recalculateMovieRating } from "../utils/reviews.js";

export async function upsertReview(req, res, next) {
  try {
    const { movie, rating, comment } = req.body;
    const sentiment = estimateSentiment(comment);
    const review = await Review.findOneAndUpdate(
      { user: req.user._id, movie },
      { rating, comment, sentiment },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate("user", "name");

    await recalculateMovieRating(new mongoose.Types.ObjectId(movie));
    req.io?.to(String(movie)).emit("review:updated", review);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
}

export async function updateReview(req, res, next) {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, sentiment: estimateSentiment(req.body.comment ?? "") },
      { new: true, runValidators: true }
    ).populate("user", "name");

    if (!review) return res.status(404).json({ message: "Review not found" });
    await recalculateMovieRating(review.movie);
    req.io?.to(String(review.movie)).emit("review:updated", review);
    res.json(review);
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ message: "Review not found" });

    await recalculateMovieRating(review.movie);
    req.io?.to(String(review.movie)).emit("review:deleted", { id: review._id });
    res.json({ message: "Review deleted" });
  } catch (error) {
    next(error);
  }
}

export async function likeReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const hasLiked = review.likedBy.some((id) => id.equals(req.user._id));
    review.likedBy = hasLiked
      ? review.likedBy.filter((id) => !id.equals(req.user._id))
      : [...review.likedBy, req.user._id];

    await review.save();
    res.json(review);
  } catch (error) {
    next(error);
  }
}
