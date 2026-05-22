import { Router } from "express";
import { loginUser, logout, registerUser } from "../controller/authController.js";
import { validateRegister } from "../middlewares/validationMiddleware.js";

const router = Router();
router.post("/register", validateRegister, registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
export default router;
