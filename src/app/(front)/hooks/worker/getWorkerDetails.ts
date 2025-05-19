"use server";
//types
import { IWorker } from "./worker.type";

import { axios } from "@/src/utils/fetcher";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const fakeWorker: IWorker = {
  id: "worker-123",
  name: "João Silva",
  login: "joao.silva",
  cpf: "123.456.789-00",
  phone: "(11) 91234-5678",
  email: "joao.silva@example.com",
  is_manager: false,
  is_admin: false,
  is_active: true,
  establishment_id: "establishment-001",
};
export const getWorkerDetails = async (
  workerId?: string,
  isDemo: boolean = false,
) => {
  if (isDemo)
    return {
      worker: fakeWorker,
    };
  const cookie = await cookies();

  const { data: worker } = await axios<IWorker>({
    route: `/api/v1/worker/${workerId}/details`,
    cookie: cookie.toString(),
    revalidateTags: [`workerId:${workerId}`],
  });

  return { worker };
};

export const revalidateWorkerDetails = async (workerId: string) => {
  revalidateTag(`workerId=${workerId}`);
};
