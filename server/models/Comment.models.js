import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userEmail: { type: String },
  userAvatar: { type: String },
  commentDesc: { type: String, required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
