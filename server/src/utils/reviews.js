import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

export function estimateSentiment(comment) {
  const positive = ["great", "excellent", "love", "beautiful", "smart", "fun", "best", "fresh", "moving"];
  const negative = ["bad", "boring", "weak", "hate", "mess", "slow", "worst", "flat", "awful"];
  const text = comment.toLowerCase();
  const score = positive.reduce((total, word) => total + (text.includes(word) ? 1 : 0), 0)
    - negative.reduce((total, word) => total + (text.includes(word) ? 1 : 0), 0);

  if (score > 0) return { label: "positive", score };
  if (score < 0) return { label: "negative", score };
  return { label: "neutral", score };
}

export async function recalculateMovieRating(movieId) {
  const stats = await Review.aggregate([
    { $match: { movie: movieId } },
    { $group: { _id: "$movie", averageRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } }
  ]);

  const rating = stats[0]?.averageRating ?? 0;
  const reviewCount = stats[0]?.reviewCount ?? 0;

  await Movie.findByIdAndUpdate(movieId, {
    averageRating: Math.round(rating * 10) / 10,
    reviewCount
  });
}
