// getters
import {
  count,
  findBy,
  findUniqueBy,
  listByEstablishment,
  validateWorker,
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
};
export { workerModel };
