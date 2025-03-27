import { InputError } from "../Errors/errors";

const isValid = (email: string): boolean => {
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const normalize = (email: string) => {
  return email.trim().toLowerCase();
};

const isValidOrThrow = (email: string) => {
  if (!isValid(email))
    throw new InputError({
      message: "Email inválido",
      action: "Informe o email com a seguinte estrutura XXXX@XXXX.XXX",
    });
};
const emailUtils = {
  isValid,
  normalize,
  isValidOrThrow,
};

export { emailUtils };
