import { axios } from "@/src/utils/fetcher";
import { cookies } from "next/headers";

export interface IResponse {
  is_admin: boolean;
}

export const verifyIfUserIsAdmin = async () => {
  try {
    const cookie = await cookies();

    const {
      data: { is_admin },
    } = await axios<IResponse>({
      route: `/api/v1/signin/isAdmin`,
      cookie: cookie.toString(),
    });

    return is_admin;
  } catch (error: any) {
    console.warn(error);
  }
};
