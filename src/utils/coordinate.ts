import { InputError } from "../Errors/errors";

const isValidLat = (latitude: string | number) => {
  latitude = latitude.toString();
  return (
    /^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/.test(latitude) &&
    !isNaN(parseFloat(latitude))
  );
};

const isValidLng = (longitude: string | number) => {
  longitude = longitude.toString();
  return (
    /^-?(1[0-7][0-9](\.\d+)?|180(\.0+)?|[0-9]{1,2}(\.\d+)?)$/.test(longitude) &&
    !isNaN(parseFloat(longitude))
  );
};

const validateAndParse = ({
  lat,
  lng,
}: {
  lat?: string | number;
  lng?: string | number;
}) => {
  if (
    lat == undefined ||
    lng == undefined ||
    !coordinateUtils.isValidLat(lat) ||
    !coordinateUtils.isValidLng(lng)
  )
    throw new InputError({
      message: "Coordanadas inválidas",
      action: "Verifique as coordenadas informadas, latitude e longitude",
    });

  return {
    lat: parseFloat(lat.toString()),
    lng: parseFloat(lng.toString()),
  };
};

const getDistanceBetween = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  isValidOrThrow({ lat: lat1, lng: lng1 });
  isValidOrThrow({ lat: lat2, lng: lng2 });

  const lat1Number = Number(lat1);
  const lng1Number = Number(lng1);

  const lat2Number = Number(lat2);
  const lng2Number = Number(lng2);

  const R = 6371; // Raio da Terra em km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2Number - lat1Number);
  const dLon = toRad(lng2Number - lng1Number);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1Number)) *
      Math.cos(toRad(lat2Number)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c * 1000; // transformando em metros
};

const isOnRatio = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  ratio: number,
) => {
  const distance = getDistanceBetween(lat1, lng1, lat2, lng2);

  if (ratio >= distance) return { isOnRatio: true, distance };
  else return { isOnRatio: false, distance };
};

const isValidOrThrow = ({ lat, lng }: { lat: number; lng: number }) => {
  if (!isValidLat(lat) || !isValidLng(lng))
    throw new InputError({
      message: "Coordenadas inválidas",
      action: "Verifique as coordenadas informadas",
    });
};

const coordinateUtils = {
  isValidLat,
  isValidLng,
  getDistanceBetween,
  isOnRatio,
  validateAndParse,
  isValidOrThrow,
};

export { coordinateUtils };
