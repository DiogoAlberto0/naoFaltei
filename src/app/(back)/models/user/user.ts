import { validateUser, findBy, count, countPeriod } from "./getters";
import { create } from "./setters";

const userModel = {
  validateUser,
  findBy,
  count,
  create,
  countPeriod,
};

export { userModel };
