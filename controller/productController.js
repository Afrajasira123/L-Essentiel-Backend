import { NotFoundError } from "../errors/customErrors.js";
import { formatImage } from "../middlewares/multerMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(4);
    res.status(200).json({ products });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, brand, size, specification, stock, isFeatured } =
      req.body;
    let image = "";
    let imagePublicId = "";
    if (req.file) {
      const file = formatImage(req.file);
      const response = await cloudinary.uploader.upload(file);
      image = response.secure_url;
      imagePublicId = response.public_id;
    }
    const newProduct = new Product({
      productName: name,
      price: price,
      description: description,
      category: category,
      brand: brand,
      size: size?.split(",") || [],
      isFeatured: isFeatured === "true" || isFeatured === true,
      image: image,
      stock: stock,
      image: image,
      imagePublicId: imagePublicId,
    });
    await newProduct.save();
    res.status(200).json({ message: "product added", newProduct });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || error.msg });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { search, currentPage, category, brand, minPrice, maxprice, sortBy } = req.query;
    const queryObject = {};
    if (search) {
      queryObject.productName = { $regex: search, $options: "i" };
    }
    if (category && category !== "ALL") {
      queryObject.category = category;
    }
    if (brand && brand !== "ALL") {
      queryObject.brand = brand;
    }
    if (minPrice && maxprice) {
      queryObject.price = { $lte: maxprice, $gte: minPrice };
    }
    let sortKey = { createdAt: -1 };
    if (sortBy === "ascending") {
      sortKey = { price: -1 };
    }
    if (sortBy === "descending") {
      sortKey = { price: 1 };
    }
    const page = Number(currentPage) || 1;
    const limit = 16;
    const skip = (page - 1) * limit;
    const products = await Product.find(queryObject).sort(sortKey).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments(queryObject);
    const totalPages = Math.ceil(totalProducts / limit);
    res.status(200).json({ products, totalPages, totalProducts });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || error.msg });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new NotFoundError("No product found");
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new NotFoundError("No product found");
    const { name, price, description, category, brand, size, stock, isFeatured } = req.body;
    if (req.file) {
      const file = formatImage(req.file);
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }
      const response = await cloudinary.uploader.destroy(file);
      product.image = response.secure_url;
      product.imagePublicId = response.public_id;
    }
    product.productName = name;
    product.price = price;
    product.description = description;
    product.brand = brand;
    product.category = category;
    product.size = size?.split(",") || [];
    product.stock = stock;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === "true" || isFeatured === true;
    await product.save();
    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new NotFoundError("No product found");
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
