import { Router } from "express";
import * as commentsController from "../controllers/commentsController";
const router = Router();

router.post("/", commentsController.create); // Create a new comment
router.get("/", commentsController.getAll); // Get all comments
router.get("/post/:post_id", commentsController.getCommentsByPost); // Get comments for a specific post
router.get("/:comment_id", commentsController.getById); // Get comment by ID
router.put("/:comment_id", commentsController.update); // Update a comment
router.delete("/:comment_id", commentsController.deleteComment); // Delete a comment

export default router;
