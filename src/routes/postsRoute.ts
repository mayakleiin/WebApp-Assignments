import { Router } from "express";
import * as postsController from "../controllers/postsController";
import * as commentsController from "../controllers/commentsController";
const router = Router();

router.post("/", postsController.create); // Add a New Post
router.get("/", postsController.getAll); // Get All Posts + Get Posts by Sender
router.get("/:post_id", postsController.getById); // Get a Post by ID
router.put("/:post_id", postsController.update); // Update a Post
router.get("/:post_id/comments", commentsController.getCommentsByPost); // Get comments for a specific post
router.delete("/:post_id", postsController.deletePost); // Delete a Post

export default router;
