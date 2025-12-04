import { UserController } from "../controller/user.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import express from "express";

const router = express.Router()

router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.post("/", upload.single("foto"), UserController.create);
router.patch("/:id", upload.single("foto"), UserController.update);
router.delete("/:id", UserController.delete);

export default router;