import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import Watchlist from "../models/Watchlist.js";

export async function listMovies(req, res, next) {
  try {
    const { search = "", genre = "", sort = "rating" } = req.query;
    const filter = {};

    if (search) filter.$text = { $search: search };
    if (genre) filter.genre = genre;

    const sortMap = {
      rating: { averageRating: -1, reviewCount: -1 },
      newest: { createdAt: -1 },
      trending: { views: -1, reviewCount: -1 },
      title: { title: 1 }
    };

    const movies = await Movie.find(filter).sort(sortMap[sort] ?? sortMap.rating).limit(60);
    res.json(movies);
  } catch (error) {
    next(error);
  }
}

export async function getMovie(req, res, next) {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const reviews = await Review.find({ movie: movie._id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({ movie, reviews });
  } catch (error) {
    next(error);
  }
}

export async function createMovie(req, res, next) {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
}

export async function updateMovie(req, res, next) {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    next(error);
  }
}

export async function deleteMovie(req, res, next) {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    await Review.deleteMany({ movie: movie._id });
    await Watchlist.deleteMany({ movie: movie._id });
    res.json({ message: "Movie deleted" });
  } catch (error) {
    next(error);
  }
}

export async function trendingMovies(req, res, next) {
  try {
    const movies = await Movie.find()
      .sort({ views: -1, reviewCount: -1, averageRating: -1 })
      .limit(10);

    res.json(movies);
  } catch (error) {
    next(error);
  }
}

export async function recommendations(req, res, next) {
  try {
    const highRated = await Review.find({ user: req.user._id, rating: { $gte: 4 } }).populate("movie");
    const watched = await Watchlist.find({ user: req.user._id }).select("movie");
    const watchedIds = watched.map((item) => item.movie);
    const likedGenres = [
      ...new Set([
        ...req.user.preferences.favoriteGenres,
        ...highRated.flatMap((review) => review.movie?.genre ?? [])
      ])
    ];

    const filter = watchedIds.length ? { _id: { $nin: watchedIds } } : {};
    if (likedGenres.length) filter.genre = { $in: likedGenres };

    const movies = await Movie.find(filter)
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(12);

    res.json(movies);
  } catch (error) {
    next(error);
  }
}
