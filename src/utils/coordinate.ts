const isValidLat = (latitude: string) => {
  return /^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/.test(latitude);
};

const isValidLng = (longitude: string) => {
  return /^-?(1[0-7][0-9](\.\d+)?|180(\.0+)?|[0-9]{1,2}(\.\d+)?)$/.test(
    longitude
  );
};

const coordinateUtils = { isValidLat, isValidLng };

export { coordinateUtils };
