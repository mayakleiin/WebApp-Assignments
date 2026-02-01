import { Request, Response } from "express";
import userModel from "../models/userModel";

const sanitizeUser = (user: any) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
  };
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const users = await userModel.find();
    return res.status(200).send(users.map(sanitizeUser));
  } catch (error: any) {
    return res.status(400).send({ error: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "Not found" });
    }
    return res.status(200).send(sanitizeUser(user));
  } catch (error: any) {
    return res.status(400).send({ error: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user?.userId;
    if (!requesterId) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    if (requesterId !== req.params.id) {
      return res.status(403).send({ error: "Forbidden" });
    }

    const allowedUpdates: any = {};
    if (typeof req.body.username === "string") allowedUpdates.username = req.body.username;
    if (typeof req.body.email === "string") allowedUpdates.email = req.body.email;

    const updated = await userModel.findByIdAndUpdate(req.params.id, allowedUpdates, {
      new: true,
    });

    if (!updated) {
      return res.status(404).send({ error: "Not found" });
    }

    return res.status(200).send(sanitizeUser(updated));
  } catch (error: any) {
    return res.status(400).send({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user?.userId;
    if (!requesterId) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    if (requesterId !== req.params.id) {
      return res.status(403).send({ error: "Forbidden" });
    }

    const deleted = await userModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).send({ error: "Not found" });
    }

    return res.status(200).send({ message: "Deleted successfully" });
  } catch (error: any) {
    return res.status(400).send({ error: error.message });
  }
};
