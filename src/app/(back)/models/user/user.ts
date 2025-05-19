import { validateUser, findBy, count } from "./getters";
import { create } from "./setters";

const userModel = {
  validateUser,
  findBy,
  count,
  create,
};

export { userModel };
