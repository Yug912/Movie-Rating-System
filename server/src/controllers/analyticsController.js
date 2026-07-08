import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

export async function analyticsSummary(req, res, next) {
  try {
    const [topRated, mostReviewed, distribution, totals] = await Promise.all([
      Movie.find().sort({ averageRating: -1, reviewCount: -1 }).limit(8),
      Movie.find().sort({ reviewCount: -1, averageRating: -1 }).limit(8),
      Review.aggregate([{ $group: { _id: "$rating", count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Promise.all([Movie.countDocuments(), Review.countDocuments()])
    ]);

    res.json({
      topRated,
      mostReviewed,
      ratingDistribution: distribution.map((item) => ({ rating: item._id, count: item.count })),
      totals: { movies: totals[0], reviews: totals[1] }
    });
  } catch (error) {
    next(error);
  }
}
