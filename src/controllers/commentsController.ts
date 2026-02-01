import commentModel, { IComment } from "../models/commentsModel";

import createController from "./baseController";

const commentsController = createController<IComment>(commentModel);

export default commentsController;
