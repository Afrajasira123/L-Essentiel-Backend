import * as dotenv from "dotenv";
dotenv.config();
// console.log("--- MY MONGO URI IS: ---", process.env.MONGODB_URI);

import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import brandRouter from "./routes/brandRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";
import addressRouter from "./routes/addressRouter.js";
import wishlistRouter from "./routes/wishlistRouter.js";
import contactRouter from "./routes/contactRouter.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import errorHandleMiddleware from "./middlewares/errorHandlingMiddleware.js";
import { authenticateUser } from "./middlewares/authenticationMiddleware.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4000",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(cookieParser());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USER,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

app.get("/", (req, res) => {
  res.send;
  ("<h1> Welcome to Ecommerce api service</h1>");
});

// our api router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", authenticateUser, userRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", authenticateUser, cartRouter);
app.use("/api/v1/address", authenticateUser, addressRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/wishlist", authenticateUser, wishlistRouter);
app.use("api/v1/contact", contactRouter);
app.use("/api/v1/payment", paymentRoutes);

//404 error handling
app.use("/*path", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

//global error handling
app.use(errorHandleMiddleware);

const port = 3000;

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Database connected successfully");
  app.listen(port, () => {
    console.log(`server started listening to ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
