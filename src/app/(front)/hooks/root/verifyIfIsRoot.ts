import { axios } from "@/src/utils/fetcher";
import { cookies } from "next/headers";

export interface IResponse {
  is_root: boolean;
}

export const verifyIfUserIsRoot = async () => {
  try {
    const cookie = await cookies();

    const {
      data: { is_root },
    } = await axios<IResponse>({
      route: `/api/v1/signin/isRoot`,
      cookie: cookie.toString(),
    });

    return is_root;
  } catch (error: any) {
    console.warn(error);
  }
};
