import { auth } from "@/auth";
import { axios } from "@/src/utils/fetcher";
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

export const verifyIfUserIsWorker = async () => {
  try {
    const session = await auth();
    const cookie = await cookies();

    const { data: worker } = await axios<IWorker>({
      route: `/api/v1/worker/${session?.user.id}/details`,
      cookie: cookie.toString(),
    });

    if (worker) return true;
    else return false;
  } catch (error: any) {
    console.warn(error);
    return false;
  }
};
