import { InputError } from "../Errors/errors";

const clean = (cep: string) => {
  return cep.replace(/\D/g, "");
};
function isValid(cep: string) {
  const cleaned = clean(cep);
  return cleaned.length == 8;
}

const isValidOrThrow = (cep: string) => {
  if (!isValid(cep))
    throw new InputError({
      message: "CEP inválido",
      action: "Informe o cep com a seguinte estrutura XXXXX-XXX",
    });
};

const cepUtils = { clean, isValid, isValidOrThrow };

export { cepUtils };
