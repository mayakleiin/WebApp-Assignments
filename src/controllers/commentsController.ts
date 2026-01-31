import { Request, Response } from "express";
import CommentModel from "../models/commentsModel";

// Create a new comment
export const createComment = async (req: Request, res: Response) => {
  try {
    const newComment = new CommentModel(req.body);
    const savedComment = await newComment.save();
    return res.status(201).json(savedComment);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res
      .status(400)
      .json({ error: `Error creating comment: ${message}` });
  }
};

// Get all comments
export const getAllComments = async (_req: Request, res: Response) => {
  try {
    const comments = await CommentModel.find();
    return res.status(200).json(comments);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res
      .status(500)
      .json({ error: `Error fetching comments: ${message}` });
  }
};

// Get comment by ID
export const getCommentById = async (req: Request, res: Response) => {
  try {
    const comment = await CommentModel.findById(req.params.comment_id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    return res.status(200).json(comment);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(400).json({ error: `Invalid comment id: ${message}` });
  }
};

// Get comments for a specific post
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const comments = await CommentModel.find({ post: req.params.post_id });
    return res.status(200).json(comments);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(400).json({ error: `Invalid post id: ${message}` });
  }
};

// Update a comment
export const updateComment = async (req: Request, res: Response) => {
  try {
    const updatedComment = await CommentModel.findByIdAndUpdate(
      req.params.comment_id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    return res.status(200).json(updatedComment);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res
      .status(400)
      .json({ error: `Error updating comment: ${message}` });
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const deletedComment = await CommentModel.findByIdAndDelete(
      req.params.comment_id,
    );

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    return res.status(200).json({ message: "Comment deleted" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res
      .status(400)
      .json({ error: `Error deleting comment: ${message}` });
  }
};
