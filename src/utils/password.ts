import { genSaltSync, hashSync, compareSync } from "bcrypt";

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

const passwordUtils = { genHash, comparePassAndHash, isValid };
export { passwordUtils };
