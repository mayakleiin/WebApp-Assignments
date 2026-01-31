const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

router.post("/", postsController.createPost); // Add a New Post
router.get("/", postsController.getAllPosts); // Get All Posts + Get Posts by Sender
router.get("/:post_id", postsController.getPostById); // Get a Post by ID
router.put("/:post_id", postsController.updatePost); // Update a Post

module.exports = router;
