"use client";

import { Map } from "@/src/components/Map/Map";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";

export const RegisterMap = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>();
  useEffect(() => {
    if (!("geolocation" in navigator))
      throw new Error("Geolocalização não suportada pelo navegador.");

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        addToast({
          color: "danger",
          title: "Erro ao definir a localização",
          description: error.PERMISSION_DENIED
            ? "Vá nas configurações do seu navegador e habilite o acesso a localização"
            : error.message,
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
      },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  if (!userLocation)
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
          markerPosition={{
            latitude: userLocation.lat - 0.00001,
            longitude: userLocation.lng - 0.00001,
          }}
        />

        <Button
          color="primary"
          className="absolute bottom-5 left-1/2 -translate-x-1/2"
        >
          Registrar ponto
        </Button>
      </div>
    );
};
