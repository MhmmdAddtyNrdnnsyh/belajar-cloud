import db from "../config/db.config.js";
import { DataTypes } from "sequelize";

const User = db.define(
  "users",
  {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    addr: DataTypes.TEXT,
    fotoUrl: DataTypes.STRING,
    fotoKey: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default User;