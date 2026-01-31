import { Router } from "express";
import * as postsController from "../controllers/postsController";
import * as commentsController from "../controllers/commentsController";
const router = Router();

router.post("/", postsController.createPost); // Add a New Post
router.get("/", postsController.getAllPosts); // Get All Posts + Get Posts by Sender
router.get("/:post_id", postsController.getPostById); // Get a Post by ID
router.put("/:post_id", postsController.updatePost); // Update a Post
router.get("/:post_id/comments", commentsController.getCommentsByPost); // Get comments for a specific post

export default router;
