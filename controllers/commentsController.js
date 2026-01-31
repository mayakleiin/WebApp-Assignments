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

// Get all comments
const getAllComments = async (req, res) => {
  try {
    const comments = await CommentModel.find();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: `Error fetching comments: ${err.message}` });
  }
};

// Get comment by ID 
const getCommentById = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.comment_id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    return res.status(200).json(comment);
  } catch (err) {
    return res.status(400).json({ error: `Invalid comment id: ${err.message}` });
  }
};

// Get comments for a specific post
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await CommentModel.find({ post: req.params.post_id });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(400).json({ error: `Invalid post id: ${err.message}` });
  }
};

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  getCommentsByPost,
};