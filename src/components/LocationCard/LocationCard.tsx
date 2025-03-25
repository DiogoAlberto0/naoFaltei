"use client";
//heroui components
import { Card, CardFooter, CardProps } from "@heroui/card";

//components
import { Map } from "@/src/components/Map/Map";
import { UpdateLocaleModal } from "./UpdateLocaleModal";

interface ILocationCardProps extends CardProps {
  establishmentId: string;
  markerPosition: {
    lat: number;
    lng: number;
  };
}
export const LocationCard = ({
  className,
  markerPosition,
  establishmentId,
  ...otherProps
}: ILocationCardProps) => {
  return (
    <Card
      isFooterBlurred
      className={`col-span-12 sm:col-span-7 ${className}`}
      {...otherProps}
    >
      <Map
        className="z-0 w-full h-full object-cover"
        markerPosition={{
          latitude: markerPosition.lat,
          longitude: markerPosition.lng,
        }}
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 flex justify-between items-center">
        <h1 className="text-xl">Localização</h1>

        <UpdateLocaleModal
          establishmentId={establishmentId}
          inicialCoords={markerPosition}
        />
      </CardFooter>
    </Card>
  );
};
