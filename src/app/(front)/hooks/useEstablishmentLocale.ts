import useSWR from "swr";
import { useEffect } from "react";

//fetcher
import { fetcher } from "@/src/utils/fetcher";

// hero uu
import { addToast } from "@heroui/toast";

export const useEstablishmentLocale = (
  { isDemo }: { isDemo: boolean } = { isDemo: false },
) => {
  const { data, error, isLoading } = useSWR<{
    lat: number;
    lng: number;
    ratio: number;
  }>(isDemo ? null : "/api/v1/establishment/getLocale", fetcher);
  useEffect(() => {
    if (error)
      addToast({
        title: error.message,
        description: error.action,
        color: "danger",
      });
  }, [error]);

  return {
    data,
    error,
    isLoading,
  };
};
