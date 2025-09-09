// reviewRoutes.js
import express from "express";
import { getReviews, review } from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();
router.get("/getreviews", protectRoute, getReviews);
router.post("/msg", protectRoute, review);

export default router;