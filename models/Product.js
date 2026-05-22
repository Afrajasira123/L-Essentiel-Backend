import mongoose, { model, Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    description: {
      type: String,
    },
    size: {
      type: [String],
    },
    specification: {
      type: Map,
    },
    totalReviews: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Product = model("Product", ProductSchema);
export default Product;
