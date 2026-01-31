import mongoose from "mongoose";

export interface IComment {
  postId: string;
  comment: string;
  sender: string;
}

const commentSchema = new mongoose.Schema<IComment>({
   postId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
});

const commentModel = mongoose.model<IComment>("Comments", commentSchema);
export default commentModel;
