const mongoose = require("mongoose")
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,

    },
    coverImg: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
