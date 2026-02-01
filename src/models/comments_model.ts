import mongoose from "mongoose";

export interface IComment {
  comment: string;
  owner: string;
  postId: string;
}

const commentSchema = new mongoose.Schema<IComment>({
  comment: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
});

const commentModel = mongoose.model<IComment>("Comments", commentSchema);
export default commentModel;
