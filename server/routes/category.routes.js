const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controllers.js");
const auth = require("../middlewares/auth.middleware.js");

// Protected routes
router.post("/", auth, createCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

module.exports = router;
