import { Router } from "express";
import { getAllUsers, getUserInfo } from "../controller/userController.js";
import { authenticateUser, isAdmin } from "../middlewares/authenticationMiddleware.js";

const router = Router();
router.get("/info", authenticateUser, getUserInfo);
router.get("/all", authenticateUser, isAdmin, getAllUsers);

export default router;
