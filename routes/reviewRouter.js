import { Router } from "express";
import { getAllProductReviews } from "../controller/reviewController.js";

const router = Router();
router("/", validateAddReview, addreview);
router("/:id", getAllProductReviews);

export default router;
