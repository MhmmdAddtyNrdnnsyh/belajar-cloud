import { UserService } from "../services/user.services.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.config.js";

export const UserController = {
  async getAll(req, res) {
    try {
      const users = await UserService.getAll();
      res.success("success to get users data", users);
    } catch (error) {
      res.error(error.message, 500);
    }
  },
  async getById(req, res) {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) return res.error("user data no found", 404);
      res.success("success to get user data", user);
    } catch (error) {
      res.error(error.message, 500);
    }
  },
  async create(req, res) {
    const { name, age, addr } = req.body;
    if (!name) return res.error("name required", 400);
    if (!age) return res.error("age required", 400);
    if (!addr) return res.error("address required", 400);
    try {
      let fotoKey = null;
      let fotoUrl = null;

      if (req.file) {
        fotoKey = `uploads/${Date.now()}-${req.file.originalname}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: fotoKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
          })
        );

        fotoUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fotoKey}`;
      }
      const data = {
        name,
        age,
        addr,
        fotoKey,
        fotoUrl,
      };
      const user = await UserService.create(data);

      res.created("success to create user", user);
    } catch (error) {
      res.error(error.message, 500);
    }
  },
  async update(req, res) {
    const { name, age, addr } = req.body;

    try {
      const user = await UserService.getById(req.params.id);
      if (!user) return res.error("user data not found", 404);

      let fotoKey = user.fotoKey;
      let fotoUrl = user.fotoUrl;

      if (req.file) {
        if (user.fotoKey) {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET,
              Key: user.fotoKey,
            })
          );
        }
        fotoKey = `uploads/${Date.now()}-${req.file.originalname}`;
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: fotoKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
          })
        );
        fotoUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fotoKey}`;
      }
      const data = {
        name: name ?? user.name,
        age: age ?? user.age,
        addr: addr ?? user.addr,
        fotoKey,
        fotoUrl,
      };
      const newUser = await UserService.update(req.params.id, data);
      res.updated("success to update user", newUser);
    } catch (error) {
      res.error("failed to update", 500);
    }
  },
  async delete(req, res) {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) return res.error("user data not found", 404);
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: user.fotoKey,
        })
      );

      const deletedUser = await UserService.delete(req.params.id);
      res.deleted("success to delete user data", deletedUser);
    } catch (error) {
      res.error(error.message, 500);
    }
  },
};
