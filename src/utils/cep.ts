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

const format = (cep: string) => {
  isValidOrThrow(cep);
  const onlyNumbers = cep.replace(/\D/g, "");

  // Aplica a máscara de CEP: 00000-000
  return onlyNumbers.replace(/^(\d{5})(\d{3})$/, "$1-$2");
};

const cepUtils = { clean, isValid, isValidOrThrow, format };

export { cepUtils };
