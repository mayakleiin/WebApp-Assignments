import { Router } from "express";
import * as commentsController from "../controllers/commentsController";
const router = Router();

router.post("/", commentsController.createComment); // Create a new comment
router.get("/", commentsController.getAllComments); // Get all comments
router.get("/post/:post_id", commentsController.getCommentsByPost); // Get comments for a specific post
router.get("/:comment_id", commentsController.getCommentById); // Get comment by ID
router.put("/:comment_id", commentsController.updateComment); // Update a comment
router.delete("/:comment_id", commentsController.deleteComment); // Delete a comment

export default router;
