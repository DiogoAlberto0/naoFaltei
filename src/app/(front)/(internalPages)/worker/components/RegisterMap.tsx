"use client";
//components
import { Map } from "@/src/app/(front)/components/Map/Map";

// hero ui
import { addToast, Button } from "@heroui/react";

//hooks
import { useLocale } from "../../../hooks/useLocale";
import { useEstablishmentLocale } from "../../../hooks/useEstablishmentLocale";
import { useRegisterClockin } from "../../../hooks/clockins/useRegisterClockin";

export const RegisterMap = ({ isDemo = false }: { isDemo?: boolean }) => {
  const { userLocation } = useLocale();

  const { data, isLoading } = useEstablishmentLocale({ isDemo });

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
            !isDemo && data
              ? {
                  latitude: data?.lat,
                  longitude: data?.lng,
                }
              : {
                  latitude: userLocation.lat + 0.001,
                  longitude: userLocation.lng + 0.001,
                }
          }
          markerRadius={isDemo ? 1000 : data?.ratio}
        />

        <Button
          color="primary"
          className="absolute bottom-5 left-1/2 -translate-x-1/2"
          isLoading={isRegistering}
          onPress={async () => {
            if (isDemo) {
              addToast({
                title: "Você está em um modo demo",
                color: "warning",
              });
            }
            handlerRegister(userLocation.lat, userLocation.lng);
          }}
        >
          Registrar ponto
        </Button>
      </div>
    );
};
