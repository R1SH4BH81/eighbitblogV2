const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog.controllers");
const authGuard = require("../middlewares/authGuard");

const router = express.Router();

router.post("/", authGuard(), createBlog);         // logged in
router.get("/", getBlogs);                         // public
router.get("/:id", getBlog);                       // public
router.put("/:id", authGuard(), updateBlog);       // logged in
router.delete("/:id", authGuard("admin"), deleteBlog); // admin only

module.exports = router;
