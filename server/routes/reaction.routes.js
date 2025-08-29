const express = require("express");
const { addReaction, countReactions } = require("../controllers/reaction.controllers");
const authGuard = require("../middlewares/authGuard");

const router = express.Router();

router.post("/", authGuard(), addReaction);               // logged in
router.get("/:postId", countReactions);                   // public

module.exports = router;
