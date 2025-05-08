import { addToast } from "@heroui/toast";
import { useState, useEffect } from "react";

export const useLocale = () => {
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

  return {
    userLocation,
  };
};
