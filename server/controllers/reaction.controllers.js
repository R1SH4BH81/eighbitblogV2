const Reaction = require("../models/Reaction.models");

// Add or update reaction
const addReaction = async (req, res) => {
  try {
    const { postId, reaction } = req.body;

    let existing = await Reaction.findOne({ postId, userId: req.user.id });
    if (existing) {
      existing.reaction = reaction;
      await existing.save();
      return res.json(existing);
    }

    const newReaction = await Reaction.create({ postId, userId: req.user.id, reaction });
    res.json(newReaction);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Count reactions
const countReactions = async (req, res) => {
  try {
    const counts = await Reaction.aggregate([
      { $match: { postId: req.params.postId } },
      { $group: { _id: "$reaction", count: { $sum: 1 } } },
    ]);
    res.json(counts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { addReaction, countReactions };
