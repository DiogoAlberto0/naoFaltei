export interface IWorker {
  id: string;
  name: string;
  login: string;
  cpf: string;
  phone: string;
  email: string;
  is_manager: boolean;
  is_admin: boolean;
  is_active: true;
  establishment_id: string;
}

export interface IWorkerByEstablishment {
  id: string;
  name: string;
  email: string;
  worker_clockin: {
    is_entry: boolean;
  }[];
}
