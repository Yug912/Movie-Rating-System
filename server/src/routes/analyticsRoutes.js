import express from "express";
import { analyticsSummary } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/summary", analyticsSummary);

export default router;
