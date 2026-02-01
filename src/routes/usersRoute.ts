import { Router } from "express";
import * as usersController from "../controllers/usersController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);
router.put("/:id", authMiddleware, usersController.update);
router.delete("/:id", authMiddleware, usersController.deleteUser);

export default router;
