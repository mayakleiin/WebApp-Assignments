import commentModel, { IComment } from "../models/comments_model";

import createController from "./base_controller";

const commentsController = createController<IComment>(commentModel);

export default commentsController;
