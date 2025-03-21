import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { InputError } from "../Errors/errors";

const genHash = (password: string) => {
  const salt = genSaltSync(10);

  const hash = hashSync(password, salt);

  return hash;
};

const comparePassAndHash = (password: string, hash: string) => {
  return compareSync(password, hash);
};

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

const passwordUtils = { genHash, comparePassAndHash, isValid, isValidOrThrow };
export { passwordUtils };
