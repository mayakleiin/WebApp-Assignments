import PostModel, { IPost } from "../models/postsModel";
import createController from "./baseController";

const postsController = createController<IPost>(PostModel);

export const create = postsController.create.bind(postsController);
export const getAll = postsController.getAll.bind(postsController);
export const getById = postsController.getById.bind(postsController);
export const update = postsController.update.bind(postsController);
export const deletePost = postsController.delete.bind(postsController);

export default postsController;
