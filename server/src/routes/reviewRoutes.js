import express from "express";
import { deleteReview, likeReview, updateReview, upsertReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, upsertReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);
router.post("/:id/like", protect, likeReview);

export default router;
