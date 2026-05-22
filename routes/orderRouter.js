import { Router } from "express";
import {
  confirmOrder,
  getAllOrders,
  getAllUserOrders,
  updateOrderStatus,
} from "../controller/orderController.js";
import { authenticateUser, isAdmin } from "../middlewares/authenticationMiddleware.js";
const router = Router();
router.patch("/confirm", authenticateUser, confirmOrder);
router.get("/", authenticateUser, isAdmin, getAllOrders);
router.get("/user/all", getAllUserOrders);
router.patch("/:id/status", authenticateUser, isAdmin, updateOrderStatus);

export default router;
