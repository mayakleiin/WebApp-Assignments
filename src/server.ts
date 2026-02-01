import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/postsRoute";
import commentsRoutes from "./routes/commentsRoute";
import authRoutes from "./routes/authRoute";
import usersRoutes from "./routes/usersRoute";  

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/post", postRoutes);
app.use("/comments", commentsRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

const initApp = async () => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", (error) => {
      console.error(error);
    });
    db.once("open", function () {
      console.log("Connected to Mongoose");
    });
    if (!process.env.DATABASE_URL) {
      reject("No DATABASE_URL");
    } else {
      mongoose.connect(process.env.DATABASE_URL).then(() => {
        resolve(app);
      });
    }
  });
};

export default initApp;
