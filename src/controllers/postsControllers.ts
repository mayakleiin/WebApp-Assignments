import PostModel, { IPost } from "../models/postsModel";
import createController from "./baseController";

const postsController = createController<IPost>(PostModel);

export default postsController;
