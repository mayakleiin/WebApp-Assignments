const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

router.post("/", postsController.createPost); // Add a New Post
router.get("/", postsController.getAllPosts); // Get All Posts + Get Posts by Sender

module.exports = router;
