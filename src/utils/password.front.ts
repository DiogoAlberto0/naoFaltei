import { InputError } from "../Errors/errors";

function isValid(password: string): boolean {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
  return passwordRegex.test(password);
}

const isValidOrThrow = (password: string) => {
  if (!isValid(password))
    throw new InputError({
      message: "Senha inválida",
      action:
        "Informe uma senha válida, a senha deve conter ao menos uma letra maiúscula um número e um caracter especial.",
    });
};

const frontPasswordUtils = { isValid, isValidOrThrow };

export { frontPasswordUtils };
