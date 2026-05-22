import { Router } from "express";
import {
  addNewBrand,
  deleteBrand,
  editBrand,
  getAllBrands,
  getSingleBrand,
} from "../controller/brandController.js";
import { validateAddBrand } from "../middlewares/validationMiddleware.js";
import { authenticateUser, isAdmin } from "../middlewares/authenticationMiddleware.js";

const router = Router();

router.post("/", authenticateUser, isAdmin, validateAddBrand, addNewBrand);
router.get("/", getAllBrands);
router.get("/:id", authenticateUser, isAdmin, getSingleBrand);
router.patch("/:id", authenticateUser, isAdmin, validateAddBrand, editBrand);
router.delete("/delete/:id", authenticateUser, isAdmin, deleteBrand);

export default router;
