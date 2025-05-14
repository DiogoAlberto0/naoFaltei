"use client";
//components
import { Map } from "@/src/app/(front)/components/Map/Map";

// hero ui
import { Button } from "@heroui/react";

//hooks
import { useLocale } from "../../../hooks/useLocale";
import { useEstablishmentLocale } from "../../../hooks/useEstablishmentLocale";
import { useRegisterClockin } from "../../../hooks/useRegisterClockin";

export const RegisterMap = () => {
  const { userLocation } = useLocale();

  const { data, isLoading } = useEstablishmentLocale();

  const { handlerRegister, isRegistering } = useRegisterClockin();

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
          isLoading={isRegistering}
          onPress={async () =>
            handlerRegister(userLocation.lat, userLocation.lng)
          }
        >
          Registrar ponto
        </Button>
      </div>
    );
};
