import express from "express";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  updateWatchlistItem
} from "../controllers/watchlistController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getWatchlist);
router.post("/:movieId", protect, addToWatchlist);
router.patch("/:movieId", protect, updateWatchlistItem);
router.delete("/:movieId", protect, removeFromWatchlist);

export default router;
