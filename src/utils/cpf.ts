const clean = (cpf: string): string => {
  return cpf.replace(/\D/g, "");
};

const isValid = (cpf: string): boolean => {
  cpf = clean(cpf);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (base: string): number => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base[i]) * (base.length + 1 - i);
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const firstDigit = calculateDigit(cpf.slice(0, 9));
  const secondDigit = calculateDigit(cpf.slice(0, 9) + firstDigit);

  return firstDigit === parseInt(cpf[9]) && secondDigit === parseInt(cpf[10]);
};

const format = (cpf: string): string => {
  cpf = clean(cpf);
  if (cpf.length !== 11) return cpf;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
};

const cpfUtils = { clean, isValid, format };

export { cpfUtils };
