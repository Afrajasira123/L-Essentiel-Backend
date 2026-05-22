import { BadRequestError, NotFoundError } from "../errors/customErrors";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

export const addReview = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("No product found");
    const existingReview = await review.findOne({
      user: req.user.userId,
      product: productId,
    });
    if (existingReview) throw new BadRequestError("User already reviewed the product");
    const user = await User.findById(req.user.userId)
      .select("orders")
      .populate("orders", "product");
    const orders = user.orders;
    const isPurchased = orders.find((item) => item.product.toString() === productId.toString());
    if (!isPurchased) throw new BadRequestError("User doesnt purchased this item");
    const newReview = new Review({
      user: req.user.userId,
      product: productId,
      review: review,
      rating: rating,
    });
    product.totalReviews = (product.totalReviews || 0) + 1;
    product.sumOfRating = (product.sumOfRating || 0) + rating;
    product.rating = product.sumOfRating / product.totalReviews;
    await product.save();
    await newReview.save();
    res.status(200).json({ message: "success", newReview });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getAllProductReviews = async (req, res) => {
  try {
    const { id } = req.params.id;
    const reviews = await Review.find({ product: id }).populate("user", "username");
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
