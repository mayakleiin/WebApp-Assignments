const CommentModel = require("../models/commentsModel");

// Create a new comment
const createComment = async (req, res) => {
  try {
    const newComment = new CommentModel(req.body);
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: `Error creating comment: ${err.message}` });
  }
};

module.exports = {
  createComment,
};