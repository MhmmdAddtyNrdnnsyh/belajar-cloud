import express from "express";
import cors from "cors";
import db from "./config/db.config.js";
import { responseMiddleware } from "./middleware/response.middleware.js";
import UserRoute from "./route/user.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express());
app.use(cors());
app.use(responseMiddleware);
app.use("/api/users", UserRoute);

const startServer = () => {
  try {
    db.authenticate();
    db.sync();
    console.log("db connetc");
    app.listen(process.env.PORT, () => {
      console.log(`app run on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

startServer();
