import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String },
  content: { type: String },
  tags: [{ type: String }],
  thumbnail: { type: String },
  coverimg: { type: String },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  slug: { type: String, unique: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  publishedAt: { type: Date },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
