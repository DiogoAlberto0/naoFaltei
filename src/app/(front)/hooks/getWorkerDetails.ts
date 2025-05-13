"use server";
import { axios } from "@/src/utils/fetcher";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

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

export const getWorkerDetails = async (workerId: string) => {
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
