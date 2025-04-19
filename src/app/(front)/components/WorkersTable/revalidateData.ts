"use server";
import { revalidateTag } from "next/cache";

export const revalidateWorker = async (workerId: string) => {
  revalidateTag(`workerId:${workerId}`);
};
