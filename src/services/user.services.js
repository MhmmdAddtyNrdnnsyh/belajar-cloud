import User from "../model/user.model.js";

export const UserService = {
  async getAll() {
    return await User.findAll();
  },
  async getById(id) {
    const user = await User.findByPk(id);
    return user;
  },
  async create(data) {
    return await User.create(data);
  },
  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;

    return await user.update(data);
  },
  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.destroy();
    return true;
  },
};
