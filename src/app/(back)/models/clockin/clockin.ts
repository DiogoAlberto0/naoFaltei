import { clockinGetters } from "./getters";
import { clockinSetters } from "./setters";

export interface IClockin {
  registered_by: string;
  is_entry: boolean;
  clocked_at: Date;
  worker_id: string;
  lat: number;
  lng: number;
  is_auto_generated: boolean;
}

const clockinModel = {
  ...clockinGetters,
  ...clockinSetters,
};

export { clockinModel };
