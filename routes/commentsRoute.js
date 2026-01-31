const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

router.post("/", commentsController.createComment); // Create a new comment
router.get("/", commentsController.getAllComments); // Get all comments
router.get("/:comment_id", commentsController.getCommentById); // Get comment by ID
router.get("/post/:post_id", commentsController.getCommentsByPost); // Get comments for a specific post
router.put("/:comment_id", commentsController.updateComment); // Update a comment
router.delete("/:comment_id", commentsController.deleteComment); // Delete a comment

module.exports = router;