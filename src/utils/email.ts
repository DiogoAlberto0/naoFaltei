const isValid = (email: string): boolean => {
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const normalize = (email: string) => {
  return email.toLowerCase();
};
const emailUtils = {
  isValid,
  normalize,
};

export { emailUtils };
