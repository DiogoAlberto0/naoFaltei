//errors
import { FetchError } from "@/src/Errors/errors";

//hero ui
import { addToast } from "@heroui/toast";

// fetcher
import { axios } from "@/src/utils/fetcher";
import { mutate } from "swr";

export const handlerRegister = async (lat: number, lng: number) => {
  try {
    const { data, response } = await axios<{ message: string }>({
      route: "/api/v1/clockin/register",
      method: "POST",
      body: {
        lat,
        lng,
      },
    });

    mutate("/api/v1/clockin/lastTwoRegisters");
    if (response.status == 200)
      addToast({
        title: data.message,
        color: "success",
      });
  } catch (error: any) {
    if (error instanceof FetchError) {
      addToast({
        title: error.message,
        description: error.action,
        color: "danger",
      });
    } else throw error;
  }
};
