"use client";

//icons
import { EditIcon } from "@/assets/icons/EditIcon";

//heroui components
import { Button } from "@heroui/button";
import { Card, CardFooter } from "@heroui/card";
import { useDisclosure } from "@heroui/modal";

//components
import { Map } from "@/src/components/Map/Map";
import { UpdateLocaleModal } from "./UpdateLocaleModal";

export const LocationCard = ({
  markerPosition,
  establishmentId,
}: {
  establishmentId: string;
  markerPosition: {
    lat: number;
    lng: number;
  };
}) => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <Card
      isFooterBlurred
      className="w-full h-[500px] col-span-12 sm:col-span-7"
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
        <Button
          endContent={<EditIcon className="h-5 w-5 stroke-primary-500" />}
          color="primary"
          onPress={onOpen}
        >
          Editar
        </Button>
      </CardFooter>

      <UpdateLocaleModal
        establishmentId={establishmentId}
        inicialCoords={markerPosition}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </Card>
  );
};
