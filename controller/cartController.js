import { NotFoundError } from "../errors/customErrors.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Product not found");

    if (product.stock < 1) {
      return res.status(400).json({
        error: "OUT_OF_STOCK",
      });
    }
    user.cart.push({ product: productId, qty: 1 });
    await user.save();
    res.status(200).json({ message: "added to cart", cart: user.cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getAllCartItems = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).populate(
      "cart.product",
      "productName image price stock",
    );
    if (!user) throw new NotFoundError("No user found");
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { itemId, qty } = req.body;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");
    const item = user.cart.find((item) => item._id.toString() === itemId.toString());
    const product = await Product.findById(item.product);
    if (!product) throw new NotFoundError("Product not found");
    if (Number(qty) > Number(product.stock)) {
      return res.status(400).json({
        error: "OUT_OF_STOCK",
        availableStock: item.product.stock,
      });
    }
    item.qty = qty;
    await user.save();
    res.status(200).json({ message: "updated", cart: user.cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const RemovefromCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { itemId } = req.body;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");
    user.cart = user.cart.filter((item) => item._id.toString() !== itemId.toString());
    await user.save();
    res.status(200).json({ message: "Removed", cart: user.cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");
    user.cart = [];
    await user.save();
    res.status(200).json({ message: "cleared", cart: user.cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
