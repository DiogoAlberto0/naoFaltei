export function isValidEmail(email: string): boolean {
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
  return passwordRegex.test(password);
}

export function isValidPhone(phone: string) {
  const regex = /^(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})$/;
  return regex.test(phone);
}

export function isValidCEP(cep: string) {
  const regex = /^[0-9]{5}-?[0-9]{3}$/;
  return regex.test(cep);
}

export function isValidLat(latitude: string) {
  return /^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/.test(latitude);
}

export function isValidLng(longitude: string) {
  return /^-?(1[0-7][0-9](\.\d+)?|180(\.0+)?|[0-9]{1,2}(\.\d+)?)$/.test(
    longitude
  );
}
