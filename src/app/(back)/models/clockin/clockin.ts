import { clockinGetters } from "./getters";
import { clockinSetters } from "./setters";

const clockinModel = {
  ...clockinGetters,
  ...clockinSetters,
};

export { clockinModel };
