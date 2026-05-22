import { NotFoundError } from "../errors/customErrors.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const addToWishlist = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.body;

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");

    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Product not found");

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
    }

    await user.save();

    res.status(200).json({
      message: "added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).populate("wishlist", "productName image price");

    if (!user) throw new NotFoundError("No user found");

    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());

    await user.save();

    res.status(200).json({
      message: "removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");

    user.wishlist = [];
    await user.save();

    res.status(200).json({
      message: "wishlist cleared",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
