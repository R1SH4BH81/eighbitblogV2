import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reaction: { type: String, enum: ["like", "celebrate", "love"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Reaction", reactionSchema);
