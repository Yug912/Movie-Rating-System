import Watchlist from "../models/Watchlist.js";

export async function getWatchlist(req, res, next) {
  try {
    const items = await Watchlist.find({ user: req.user._id })
      .populate("movie")
      .sort({ updatedAt: -1 });

    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function addToWatchlist(req, res, next) {
  try {
    const item = await Watchlist.findOneAndUpdate(
      { user: req.user._id, movie: req.params.movieId },
      { status: req.body.status ?? "planned" },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("movie");

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function updateWatchlistItem(req, res, next) {
  try {
    const status = req.body.status;
    const item = await Watchlist.findOneAndUpdate(
      { user: req.user._id, movie: req.params.movieId },
      { status, watchedAt: status === "watched" ? new Date() : undefined },
      { new: true, runValidators: true }
    ).populate("movie");

    if (!item) return res.status(404).json({ message: "Watchlist item not found" });
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function removeFromWatchlist(req, res, next) {
  try {
    await Watchlist.findOneAndDelete({ user: req.user._id, movie: req.params.movieId });
    res.json({ message: "Removed from watchlist" });
  } catch (error) {
    next(error);
  }
}
