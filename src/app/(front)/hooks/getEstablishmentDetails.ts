"use server";
import { cookies } from "next/headers";

import { axios } from "@/src/utils/fetcher";
import { revalidateTag } from "next/cache";

export interface IEstablishment {
  name: string;
  phone: string;
  email: string;
  cep: string;
  lat: number;
  lng: number;
  ratio: number;
}
export const getEstablishmentDetails = async (establishmentId: string) => {
  const cookie = await cookies();
  const { data: establishmentData } = await axios<IEstablishment>({
    route: `/api/v1/establishment/${establishmentId}/details`,
    cookie: cookie.toString(),
    revalidateTags: [`establishmentId=${establishmentId}`],
  });

  return establishmentData;
};

export const revalidateEstablishmentDetails = async (
  establishmentId: string,
) => {
  revalidateTag(`establishmentId=${establishmentId}`);
};
