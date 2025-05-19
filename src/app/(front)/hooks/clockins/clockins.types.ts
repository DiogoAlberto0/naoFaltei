export interface IRegister {
  id: string;
  clocked_at: string;
  is_entry: boolean;
  worker: {
    name: string;
    email: string;
  };
}
