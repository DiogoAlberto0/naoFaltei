"use client";
import { useEffect } from "react";

//components
import { Map } from "@/src/app/(front)/components/Map/Map";

// hero ui
import { addToast, Button } from "@heroui/react";

//fetcher
import useSWR from "swr";
import { fetcher } from "@/src/utils/fetcher";
import { handlerRegister } from "./handlerRegister";

//hooks
import { useLocale } from "./useLocale";

export const RegisterMap = () => {
  const { userLocation } = useLocale();

  const { data, error, isLoading } = useSWR<{
    lat: number;
    lng: number;
    ratio: number;
  }>("/api/v1/establishment/getLocale", fetcher);

  useEffect(() => {
    if (error)
      addToast({
        title: error.message,
        description: error.action,
        color: "danger",
      });
  }, [error]);

  if (!userLocation || isLoading)
    return (
      <div className="flex-1 flex justify-center items-center">
        Localizando...
      </div>
    );
  else
    return (
      <div className="flex-1 z-0 flex relative">
        <Map
          className="flex-1 z-0"
          userLocationPosition={{
            latitude: userLocation.lat,
            longitude: userLocation.lng,
          }}
          markerPosition={
            data && {
              latitude: data?.lat,
              longitude: data?.lng,
            }
          }
          markerRadius={data?.ratio && data.ratio}
        />

        <Button
          color="primary"
          className="absolute bottom-5 left-1/2 -translate-x-1/2"
          onPress={async () =>
            await handlerRegister(userLocation.lat, userLocation.lng)
          }
        >
          Registrar ponto
        </Button>
      </div>
    );
};
