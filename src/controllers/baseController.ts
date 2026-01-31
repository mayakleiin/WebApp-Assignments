import { Request, Response } from "express";
import { Model, AnyExpression } from "mongoose";

export class BaseController<T> {
  model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // Create a new item
  async create(req: Request, res: Response) {
    const _id = req.query.userId;
    try {
      const data = await this.model.create({
        ...req.body,
        owner: _id,
      });
      res.status(201).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  // Get all items
  async getAll(req: Request, res: Response) {
    const ownerFilter = req.query.owner as string;
    try {
      const query = ownerFilter ? { owner: ownerFilter } : {};
      const items = await this.model.find(query);
      res.status(200).send(items);
    } catch (error) {
      res
        .status(400)
        .send({ error: "Failed to fetch items", details: error.message });
    }
  }

  // Get an item by ID
  async getById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const item = await this.model.findById(id);
      if (item) {
        res.status(200).send(item);
      } else {
        res.status(404).send({ error: "Item not found" });
      }
    } catch (error) {
      res
        .status(400)
        .send({ error: "Failed to fetch item", details: error.message });
    }
  }

  // Update an item by ID
  async update(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.query.userId as string;

    try {
      const currentItem = await this.model.findById(id);
      const ownerItem = (currentItem as AnyExpression)?.owner;

      if (ownerItem !== userId) {
        return res
          .status(401)
          .send({ error: "Unauthorized to update this item" });
      }

      const updatedItem = await this.model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedItem) {
        return res.status(404).send({ error: "Item not found" });
      }

      res.status(200).send(updatedItem);
    } catch (error) {
      res
        .status(400)
        .send({ error: "Failed to update item", details: error.message });
    }
  }

  // Delete an item by ID
  async delete(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.query.userId as string;

    try {
      const currentItem = await this.model.findById(id);
      const ownerItem = (currentItem as AnyExpression)?.owner;

      if (ownerItem !== userId) {
        return res
          .status(401)
          .send({ error: "Unauthorized to delete this item" });
      }

      const deletedItem = await this.model.deleteOne({ _id: id });

      if (deletedItem.deletedCount === 0) {
        return res.status(404).send({ error: "Item not found" });
      }

      res.status(200).send({ message: "Item deleted successfully" });
    } catch (error) {
      res
        .status(400)
        .send({ error: "Failed to delete item", details: error.message });
    }
  }
}

const createController = <T>(model: Model<T>) => {
  return new BaseController(model);
};

export default createController;
