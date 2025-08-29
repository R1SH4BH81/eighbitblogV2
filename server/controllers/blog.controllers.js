const Blog = require("../models/Blog.models");
const Comment = require("../models/Comment.models");

// Create blog
const createBlog = async (req, res) => {
  try {
    const { title, desc, content, tags, category } = req.body;

    const thumbnailUrl = req.files.thumbnail ? req.files.thumbnail[0].firebaseUrl : null;
    const coverUrl = req.files.coverimg ? req.files.coverimg[0].firebaseUrl : null;

    const blog = await Blog.create({
      title,
      desc,
      content,
      tags: tags ? tags.split(",") : [],
      thumbnail: thumbnailUrl,
      coverimg: coverUrl,
      authorId: req.user.id,
      category,
    });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("authorId", "username email").populate("category", "name");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get single blog
const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("comments");
    if (!blog) return res.status(404).json({ msg: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { createBlog, getBlogs, getBlog, updateBlog, deleteBlog };
