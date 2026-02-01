import { Router } from "express";
import * as commentsController from "../controllers/commentsController";

const router = Router();

router.post("/", commentsController.create); // Create a new comment
router.get("/", commentsController.getAll); // Get all comments
router.get("/post/:id", commentsController.getCommentsByPost); // Get comments for a specific post
router.get("/:id", commentsController.getById); // Get comment by ID
router.put("/:id", commentsController.update); // Update a comment
router.delete("/:id", commentsController.deleteComment); // Delete a comment

export default router;
