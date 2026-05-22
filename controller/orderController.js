import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { NotFoundError, BadRequestError } from "../errors/customErrors.js";
import mongoose from "mongoose";

// export const orderProduct = async (req, res) => {
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const { userId } = req.user;
//     const user = await User.findById(userId)
//       .populate("cart.product", "productName price stock")
//       .session(session);
//     if (!user) throw new NotFoundError("User not found");

//     const { address } = req.body;
//     if (user.cart.length < 1) throw new BadRequestError("Cart is Empty");
//     let grandTotal = 0;
//     let purchaseItems = user.cart;
//     for (let cartItem of user.cart) {
//       const { product, qty } = cartItem;
//       if (product.stock < qty) throw new BadRequestError("Product Out of stock");
//       const totalPrice = product.price * qty;
//       const prdt = await Product.findById(product._id).session(session);
//       prdt.stock = prdt.stock - qty;
//       // Create order
//       const newOrder = new Order({
//         user: userId,
//         product: product._id,
//         qty,
//         totalPrice,
//         status: "pending",
//         address: address,
//       });
//       grandTotal = grandTotal + totalPrice;
//       await prdt.save({ session });
//       await newOrder.save({ session });
//       user.orders.push(newOrder._id);
//     }

//     user.cart = [];
//     await user.save({ session });
//     await session.commitTransaction();
//     session.endSession();
//     res.status(200).json({ purchaseItems, grandTotal });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(error.statusCode || 500).json({ error: error.message });
//   }
// };
export const confirmOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { paymentId, address } = req.body;
    const { userId } = req.user;

    if (!paymentId) {
      throw new BadRequestError("Payment ID is required");
    }

    const user = await User.findById(userId)
      .populate("cart.product", "productName price stock")
      .session(session);

    if (!user) throw new NotFoundError("User not found");
    if (user.cart.length === 0) throw new BadRequestError("Cart is empty");

    let grandTotal = 0;

    for (const cartItem of user.cart) {
      const { product, qty } = cartItem;

      if (product.stock < qty) {
        throw new BadRequestError(`${product.productName} is out of stock`);
      }

      const totalPrice = product.price * qty;

      const newOrder = new Order({
        user: userId,
        product: product._id,
        qty,
        totalPrice,
        paymentId,
        status: "Confirmed",
        address,
      });

      product.stock -= qty;
      grandTotal += totalPrice;

      await product.save({ session });
      await newOrder.save({ session });

      user.orders.push(newOrder._id);
    }

    user.cart = [];
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      grandTotal,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { currentPage, status } = req.query;
    const queryObject = {};
    if (status && status !== "ALL") {
      queryObject.status = status;
    }
    const page = Number(currentPage) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;
    const orders = await Order.find(queryObject)
      .sort({ createdAt: -1 })
      .populate("user", "username email address")
      .populate("product", "productName price image")
      .skip(skip)
      .limit(limit);
    const totalOrders = await Order.countDocuments(queryObject);
    const totalPages = Math.ceil(totalOrders / limit);
    res.status(200).json({ totalOrders, totalPages, orders });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getAllUserOrders = async (req, res) => {
  try {
    const { currentPage, status } = req.query;
    const queryObject = { user: req.user.userId };
    if (status && status !== "ALL") {
      queryObject.status = status;
    }
    const page = Number(currentPage) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;
    const orders = await Order.find(queryObject)
      .sort({
        createdAt: -1,
      })
      .populate("product", "productName image price")
      .skip(skip)
      .limit(limit);
    const totalOrders = await Order.countDocuments(queryObject);
    const totalPages = Math.ceil(totalOrders / limit);
    res.status(200).json({ orders, totalOrders, totalPages });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatus = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    const order = await Order.findById(id);
    if (!order) throw new NotFoundError("No order Found");
    order.status = status;
    await order.save();
    const populateOrder = await Order.findById(id)
      .populate("user", "username")
      .populate("product", "productName price");
    res.status(200).json({
      message: "order status updated successfully",
      order: populateOrder,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
