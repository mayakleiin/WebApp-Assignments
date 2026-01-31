import { Request, Response } from "express";
import PostModel from "../models/postsModel";

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  try {
    const newPost = await PostModel.create(req.body);
    return res.status(201).json(newPost);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(400).json({ message });
  }
};

// Get All Posts + Get Posts by Sender
export const getAllPosts = async (req: Request, res: Response) => {
  const filter = req.query.sender as string | undefined;

  try {
    if (filter) {
      const posts = await PostModel.find({ sender: filter });
      return res.status(200).json(posts);
    }

    const posts = await PostModel.find();
    return res.status(200).json(posts);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(400).json({ message });
  }
};

// Get a Post by ID
export const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.post_id;

  try {
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.status(200).json(post);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(400).json({ message });
  }
};

// Update a Post
export const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.post_id;

  try {
    const post = await PostModel.findByIdAndUpdate(postId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.status(200).json(post);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(400).json({ message });
  }
};
