import { NotFoundError } from "../errors/customErrors.js";
import Category from "../models/Category.js";

export const AddCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const newCategory = new Category({
      categoryName: categoryName,
    });
    await newCategory.save();
    res.status(200).json({ message: "success", newCategory });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const category = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(category);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const SingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) throw new NotFoundError("No Category Found");
    res.status(200).json(category);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;
    const category = await Category.findByIdAndUpdate(
      id,
      { categoryName: categoryName },
      { new: true },
    );
    if (!category) throw new NotFoundError("No category Found");
    res.status(200).json({ message: "updated successfully", category });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new NotFoundError("no category Found");
    res.status(200).json({ message: "Category deleted", category });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
