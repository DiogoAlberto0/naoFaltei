// getters
import {
  count,
  findBy,
  findUniqueBy,
  listByEstablishment,
  validateWorker,
  countPeriod,
} from "./getters";
import { create, disable, setManager, update } from "./setters";

const workerModel = {
  create,
  findBy,
  count,
  validateWorker,
  update,
  findUniqueBy,
  listByEstablishment,
  disable,
  setManager,
  countPeriod,
};
export { workerModel };
