import { Router } from "express";
import { validateAddCategory } from "../middlewares/validationMiddleware.js";
import {
  AddCategory,
  deleteCategory,
  editCategory,
  getAllCategory,
  SingleCategory,
} from "../controller/categoryController.js";
import { authenticateUser, isAdmin } from "../middlewares/authenticationMiddleware.js";

const router = Router();

router.post("/", authenticateUser, isAdmin, validateAddCategory, AddCategory);
router.get("/", getAllCategory);
router.get("/:id", authenticateUser, isAdmin, SingleCategory);
router.patch("/:id", authenticateUser, isAdmin, validateAddCategory, editCategory);
router.delete("/:id", authenticateUser, isAdmin, deleteCategory);

export default router;
