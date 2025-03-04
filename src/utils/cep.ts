const clean = (cep: string) => {
  return cep.replace(/\D/g, "");
};
function isValid(cep: string) {
  const cleaned = clean(cep);
  return cleaned.length == 8;
}

const cepUtils = { clean, isValid };

export { cepUtils };
