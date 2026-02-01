import { Router } from "express";
import * as commentsController from "../controllers/commentsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, commentsController.create); // Create a new comment
router.get("/", commentsController.getAll); // Get all comments
router.get("/post/:id", commentsController.getCommentsByPost); // Get comments for a specific post
router.get("/:id", commentsController.getById); // Get comment by ID
router.put("/:id", authMiddleware, commentsController.update); // Update a comment
router.delete("/:id", authMiddleware, commentsController.deleteComment); // Delete a comment

export default router;
