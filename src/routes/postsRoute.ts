import { Router } from "express";
import * as postsController from "../controllers/postsController";
import * as commentsController from "../controllers/commentsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, postsController.create); // Add a new post
router.get("/", postsController.getAll); // Get all posts (and optionally filters via query)
router.get("/:id", postsController.getById); // Get a post by ID
router.put("/:id", authMiddleware, postsController.update); // Update a post
router.get("/:id/comments", commentsController.getCommentsByPost); // Get comments for a specific post
router.delete("/:id", authMiddleware, postsController.deletePost); // Delete a post

export default router;
