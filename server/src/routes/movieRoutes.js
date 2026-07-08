import express from "express";
import {
  createMovie,
  deleteMovie,
  getMovie,
  listMovies,
  recommendations,
  trendingMovies,
  updateMovie
} from "../controllers/movieController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listMovies);
router.get("/trending", trendingMovies);
router.get("/recommendations", protect, recommendations);
router.get("/:id", getMovie);
router.post("/", protect, adminOnly, createMovie);
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;
