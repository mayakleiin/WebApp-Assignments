import mongoose from "mongoose";

export interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  refreshTokens: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    default: [],
  },
});

const userModel = mongoose.model<IUser>("Users", userSchema);
export default userModel;
