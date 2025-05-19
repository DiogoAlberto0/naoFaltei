import { auth } from "@/auth";
import { axios } from "@/src/utils/fetcher";
import { cookies } from "next/headers";
import { IWorker } from "./worker.type";

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

export const verifyIfUserIsManager = async () => {
  try {
    const session = await auth();
    const cookie = await cookies();

    const { data: worker } = await axios<IWorker>({
      route: `/api/v1/worker/${session?.user.id}/details`,
      cookie: cookie.toString(),
    });

    if (worker.is_manager) return true;
    else return false;
  } catch (error: any) {
    console.warn(error);
    return false;
  }
};
