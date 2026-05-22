import { Router } from "express";
import {
  validateAddToCart,
  validateRemoveCart,
  validateUpdateCart,
} from "../middlewares/validationMiddleware.js";
import {
  addToCart,
  clearCart,
  getAllCartItems,
  RemovefromCart,
  updateCart,
} from "../controller/cartController.js";

const router = Router();

router.patch("/add", validateAddToCart, addToCart);
router.get("/", getAllCartItems);
router.patch("/update/:id", validateUpdateCart, updateCart);
router.patch("/remove", validateRemoveCart, RemovefromCart);
router.patch("/clear", clearCart);

export default router;
