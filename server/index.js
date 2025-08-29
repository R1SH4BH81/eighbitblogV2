const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cleanExpiredTokens = require("./jobs/cleanTokens");

dotenv.config();
const app = express();

app.use(express.json());

// routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/blogs", require("./routes/blog.routes"));
app.use("/api/comments", require("./routes/comment.routes"));
app.use("/api/reactions", require("./routes/reaction.routes"));
app.use("/api/categories", require("./routes/category.routes"));


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // start cron job
    cleanExpiredTokens();

    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("DB error:", err));
