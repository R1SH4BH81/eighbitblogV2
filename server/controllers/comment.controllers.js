const Comment = require("../models/Comment.models");
const Blog = require("../models/Blog.models");

// Add comment
const addComment = async (req, res) => {
  try {
    const { commentDesc, blogId } = req.body;
    const comment = await Comment.create({
      userId: req.user.id,
      userEmail: req.user.email,
      userAvatar: req.user.avatar,
      commentDesc,
      blogId,
    });

    await Blog.findByIdAndUpdate(blogId, { $push: { comments: comment._id } });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get comments for blog
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId }).populate("userId", "username");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { addComment, getComments };
