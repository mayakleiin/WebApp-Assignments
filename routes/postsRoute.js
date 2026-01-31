const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const commentsController = require("../controllers/commentsController");

router.post("/", postsController.createPost); // Add a New Post
router.get("/", postsController.getAllPosts); // Get All Posts + Get Posts by Sender
router.get("/:post_id", postsController.getPostById); // Get a Post by ID
router.put("/:post_id", postsController.updatePost); // Update a Post
router.get("/:post_id/comments", commentsController.getCommentsByPost); // Get comments for a specific post

module.exports = router;
