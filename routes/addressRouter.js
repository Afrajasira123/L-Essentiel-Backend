import { Router } from "express";
import { validateAddAddress } from "../middlewares/validationMiddleware.js";
import {
  addAddress,
  editAddress,
  getAddresses,
  removeAddress,
  setDefaultAddress,
} from "../controller/addressController.js";

const router = Router();
router.get("/", getAddresses);
router.patch("/add", validateAddAddress, addAddress);
router.patch("/edit/:id", editAddress);
router.patch("/remove/:id", removeAddress);
router.patch("/default/:id", setDefaultAddress);

export default router;
