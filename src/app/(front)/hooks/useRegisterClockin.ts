import { useState } from "react";

//errors
import { FetchError, InputError } from "@/src/Errors/errors";

// fetcher
import { axios } from "@/src/utils/fetcher";
import { mutate } from "swr";

// hero ui
import { addToast } from "@heroui/toast";

// utils
import { dateUtils } from "@/src/utils/date";

export const useRegisterClockin = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const [lastRegisterDate, setLastRegisterDate] = useState<Date | null>(null);

  const handlerRegister = async (lat: number, lng: number) => {
    try {
      setIsRegistering(true);

      if (
        lastRegisterDate &&
        dateUtils.calculateMinutesBetween(lastRegisterDate, new Date()) < 5
      )
        throw new InputError({
          message: "Você registrou um ponto há menos de 5 minutos.",
          action:
            "Espere um pouco antes de tentar de novo. Se precisar registrar agora, recarregue a página.",
        });

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
      } else if (error instanceof InputError) {
        addToast({
          title: error.message,
          description: error.action,
          color: "warning",
        });
      } else throw error;
    } finally {
      setIsRegistering(false);
      setLastRegisterDate(new Date());
    }
  };

  return {
    isRegistering,
    handlerRegister,
  };
};
