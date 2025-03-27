import { InputError } from "../Errors/errors";

const isValid = (login: string): boolean => {
  const loginRegex = /^[\w.-]+@[\w.-]+$/;
  return loginRegex.test(login);
};

const normalize = (login: string) => {
  if (!login) return "";
  return login.trim().toLowerCase();
};

const isValidOrThrow = (login: string) => {
  if (!isValid(login))
    throw new InputError({
      message: "Login inválido",
      action:
        "Informe o login com a seguinte estrutura: NomeDoFuncionário@NomeDaEmpresa",
    });
};

const loginUtils = {
  isValid,
  normalize,
  isValidOrThrow,
};

export { loginUtils };
