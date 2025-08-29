const Category = require("../models/Category.models");

// Create category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ msg: "Category already exists" });

    const category = await Category.create({
      name,
      description,
      createdBy: req.user.id, // from auth middleware
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("createdBy", "username email");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get single category
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("createdBy", "username email");
    if (!category) return res.status(404).json({ msg: "Category not found" });

    res.json(category);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: "Category not found" });

    // only creator can update
    if (category.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();

    res.json(category);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: "Category not found" });

    if (category.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await category.deleteOne();
    res.json({ msg: "Category deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
