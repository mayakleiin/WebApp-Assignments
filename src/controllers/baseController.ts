import { Request, Response } from "express";
import { Model, Document } from "mongoose";

type WithSender = {
  sender: string;
};

class BaseController<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      const body = { ...req.body, sender: userId };
      const item = await this.model.create(body);

      return res.status(201).send(item);
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const items = await this.model.find();
      return res.status(200).send(items);
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const item = await this.model.findById(req.params.id);
      if (!item) {
        return res.status(404).send({ error: "Not found" });
      }
      return res.status(200).send(item);
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      const existing = await this.model.findById(req.params.id);
      if (!existing) {
        return res.status(404).send({ error: "Not found" });
      }

      const owner = (existing as unknown as WithSender).sender;
      if (owner !== userId) {
        return res.status(403).send({ error: "Forbidden" });
      }

      const updated = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
      );

      return res.status(200).send(updated);
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      const existing = await this.model.findById(req.params.id);
      if (!existing) {
        return res.status(404).send({ error: "Not found" });
      }

      const owner = (existing as unknown as WithSender).sender;
      if (owner !== userId) {
        return res.status(403).send({ error: "Forbidden" });
      }

      await this.model.findByIdAndDelete(req.params.id);
      return res.status(200).send({ message: "Deleted successfully" });
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  }
}

export default function createController<T>(model: Model<T>) {
  return new BaseController<T>(model);
}
