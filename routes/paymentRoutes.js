import express from "express";
import { createPaymentIntent } from "../controller/paymentController.js";
import { authenticateUser } from "../middlewares/authenticationMiddleware.js";

const router = express.Router();

router.post("/create-intent", authenticateUser, createPaymentIntent);

export default router;
