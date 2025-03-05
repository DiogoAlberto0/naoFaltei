const clean = (phone: string) => {
  return phone.replace(/\D/g, "");
};

const isValid = (phone: string) => {
  const cleaned = clean(phone);
  return cleaned.length == 11 || cleaned.length == 10;
};

function format(phone: string) {
  phone = clean(phone);

  // Aplica a formatação (XX) XXXXX-XXXX
  if (phone.length === 11) {
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
  }

  if (phone.length === 10) {
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
  }

  return phone; // Se o phone não tiver 11 dígitos, retorna como está
}

const phoneUtils = {
  clean,
  isValid,
  format,
};

export { phoneUtils };
