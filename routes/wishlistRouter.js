import { Router } from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
} from "../controller/wishlistController.js";
import {
  validateAddToWishlist,
  validateRemoveFromWishlist,
} from "../middlewares/validationMiddleware.js";

const router = Router();

router.patch("/add", validateAddToWishlist, addToWishlist);
router.patch("/remove/:productId", validateRemoveFromWishlist, removeFromWishlist);
router.get("/", getWishlist);
router.patch("/clear", clearWishlist);

export default router;
