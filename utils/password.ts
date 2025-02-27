import { genSaltSync, hashSync, compareSync } from "bcrypt";

const genHash = (password: string) => {
  const salt = genSaltSync(10);

  const hash = hashSync(password, salt);

  return hash;
};

const comparePassAndHash = (password: string, hash: string) => {
  return compareSync(password, hash);
};

export { genHash, comparePassAndHash };
