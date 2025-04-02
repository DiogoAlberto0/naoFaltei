import { InputError } from "../Errors/errors";

const isValidLat = (latitude: string) => {
  return (
    /^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/.test(latitude) &&
    !isNaN(parseFloat(latitude))
  );
};

const isValidLng = (longitude: string) => {
  return (
    /^-?(1[0-7][0-9](\.\d+)?|180(\.0+)?|[0-9]{1,2}(\.\d+)?)$/.test(longitude) &&
    !isNaN(parseFloat(longitude))
  );
};

const getDistanceBetween = (
  lat1: string,
  lng1: string,
  lat2: string,
  lng2: string,
): number => {
  if (
    !isValidLat(lat1) ||
    !isValidLng(lng1) ||
    !isValidLat(lat2) ||
    !isValidLng(lng2)
  )
    throw new InputError({
      message: "Coordenadas inválidas",
      action: "Verifique as coordenadas informadas",
    });
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

  return R * c;
};

const isOnRatio = (
  lat1: string,
  lng1: string,
  lat2: string,
  lng2: string,
  ratio: number,
) => {
  const distance = getDistanceBetween(lat1, lng1, lat2, lng2);

  if (ratio >= distance) return true;
  else return false;
};

const coordinateUtils = {
  isValidLat,
  isValidLng,
  getDistanceBetween,
  isOnRatio,
};

export { coordinateUtils };
