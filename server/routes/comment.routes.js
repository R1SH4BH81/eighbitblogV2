const express = require("express");
const { addComment, getComments } = require("../controllers/comment.controllers");
const authGuard = require("../middlewares/authGuard");

const router = express.Router();

router.post("/", authGuard(), addComment);           // logged in
router.get("/:blogId", getComments);                 // public

module.exports = router;
