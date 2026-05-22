import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  getFeaturedProducts,
  getSingleProduct,
} from "../controller/productController.js";
import upload from "../middlewares/multerMiddleware.js";
import { authenticateUser, isAdmin } from "../middlewares/authenticationMiddleware.js";
import { validateAddProduct } from "../middlewares/validationMiddleware.js";

const router = Router();
router.post("/", authenticateUser, isAdmin, upload.single("image"), validateAddProduct, addProduct);
router.get("/featured", getFeaturedProducts);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.patch(
  "/:id",
  authenticateUser,
  isAdmin,
  upload.single("image"),
  validateAddProduct,
  editProduct
);
router.delete("/delete/:id", authenticateUser, isAdmin, deleteProduct);
export default router;
