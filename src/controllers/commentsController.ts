import commentModel, { IComment } from "../models/commentsModel";
import createController from "./baseController";
import { Request, Response } from "express";

const commentsController = createController<IComment>(commentModel);

export const getCommentsByPost = async (req: Request, res: Response) => {
  const postId = req.params.post_id;
  try {
    const comments = await commentModel.find({ post: postId });
    res.status(200).send(comments);
  } catch (error) {
    res
      .status(400)
      .send({ error: "Failed to fetch comments", details: error.message });
  }
};

export const create = commentsController.create.bind(commentsController);
export const getAll = commentsController.getAll.bind(commentsController);
export const getById = commentsController.getById.bind(commentsController);
export const update = commentsController.update.bind(commentsController);
export const deleteComment = commentsController.delete.bind(commentsController);

export default commentsController;