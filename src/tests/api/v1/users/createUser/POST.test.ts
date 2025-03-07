import { describe, it, expect, beforeAll } from "vitest";

import { IUserWithoutHash, prisma } from "@/prisma/prisma";

import { userModel } from "@/src/models/user";
import { signinForTest } from "../../signinForTest";

let validManager: IUserWithoutHash;
const managerEmail = "manager@email.com";
const managerPass = "123456789Abc.";
let cookies: string;

beforeAll(async () => {
  await prisma.$queryRawUnsafe(
    `TRUNCATE TABLE "users", "establishments" RESTART IDENTITY CASCADE;`
  );

  validManager = await userModel.create({
    email: managerEmail,
    password: managerPass,
    name: "manager",
  });

  const resp = await signinForTest({
    email: managerEmail,
    password: managerPass,
  });

  cookies = resp.cookies;

  expect(await userModel.count()).toEqual(1);
});

const validUser = {
  email: "teste@teste.com",
  password: "135792478Abc.",
  name: "userName",
};

describe("POST on /api/v1/user/createUser", () => {
  describe("Anonymous user", () => {
    it("asdfasdfasd", async () => {
      const response2 = await fetch(
        "http://localhost:3000/api/v1/user/createUser",
        {
          method: "POST",
          body: JSON.stringify({
            ...validUser,
            name: "",
          }),
          credentials: "include",
          headers: {
            Cookie: cookies,
          },
        }
      );

      console.log(await response2.json());
    });
    // it("should not be possible to create a new user if name is not provided", async () => {
    //   const response = await fetch(
    //     "http://localhost:3000/api/v1/user/createUser",
    //     {
    //       method: "POST",
    //       body: JSON.stringify({
    //         ...validUser,
    //         name: "",
    //       }),
    //     }
    //   );

    //   expect(response.status).toEqual(400);

    //   const json = await response.json();

    //   expect(json).toStrictEqual({
    //     message: "Campos obrigatórios faltando.",
    //     action: "Informe nome, email e senha do usuário",
    //   });

    //   expect(await userModel.count()).toEqual(0);
    // });

    // it("should not be possible to create a new user with invalid email", async () => {
    //   const response = await fetch(
    //     "http://localhost:3000/api/v1/user/createUser",
    //     {
    //       method: "POST",
    //       body: JSON.stringify({
    //         ...validUser,
    //         email: "test-teste.com",
    //       }),
    //     }
    //   );

    //   expect(response.status).toEqual(400);

    //   const json = await response.json();

    //   expect(json).toStrictEqual({
    //     message: "Email inválido.",
    //     action:
    //       "Informe um email válido seguindo a seguinte estrutura: XXXX@XXXX.XXX",
    //   });

    //   expect(await userModel.count()).toEqual(0);
    // });

    // it("should not be possible to create a new user if email is not provided", async () => {
    //   const response = await fetch(
    //     "http://localhost:3000/api/v1/user/createUser",
    //     {
    //       method: "POST",
    //       body: JSON.stringify({
    //         ...validUser,
    //         email: "",
    //       }),
    //     }
    //   );

    //   expect(response.status).toEqual(400);

    //   const json = await response.json();

    //   expect(json).toStrictEqual({
    //     message: "Campos obrigatórios faltando.",
    //     action: "Informe nome, email e senha do usuário",
    //   });

    //   expect(await userModel.count()).toEqual(0);
    // });

    // it("should not be possible to create a new user with invalid password", async () => {
    //   const response = await fetch(
    //     "http://localhost:3000/api/v1/user/createUser",
    //     {
    //       method: "POST",
    //       body: JSON.stringify({
    //         ...validUser,
    //         password: "1234",
    //       }),
    //     }
    //   );

    //   expect(response.status).toEqual(400);

    //   const json = await response.json();

    //   expect(json).toStrictEqual({
    //     message: "Senha inválida.",
    //     action:
    //       "Informe uma senha válida, a senha deve conter ao menos uma letra maiúscula um número e um caracter especial.",
    //   });

    //   expect(await userModel.count()).toEqual(0);
    // });

    // it("should not be possible to create a new user if password is not provided", async () => {
    //   const response = await fetch(
    //     "http://localhost:3000/api/v1/user/createUser",
    //     {
    //       method: "POST",
    //       body: JSON.stringify({
    //         ...validUser,
    //         password: "",
    //       }),
    //     }
    //   );

    //   expect(response.status).toEqual(400);

    //   const json = await response.json();

    //   expect(json).toStrictEqual({
    //     message: "Campos obrigatórios faltando.",
    //     action: "Informe nome, email e senha do usuário",
    //   });

    //   expect(await userModel.count()).toEqual(0);
    // });

    // it("should be possible to create new user", async () => {
    //   const response = await fetch(
    //     "http://localhost:3000/api/v1/user/createUser",
    //     {
    //       method: "POST",
    //       body: JSON.stringify(validUser),
    //     }
    //   );

    //   expect(response.status).toEqual(201);

    //   const json = await response.json();

    //   const userFromDB = await userModel.findByEmail(validUser.email);

    //   expect(userFromDB).toEqual({
    //     id: expect.any(String),
    //     name: validUser.name,
    //     email: validUser.email,
    //     emailVerified: null,
    //     image: null,
    //     hash: expect.any(String),
    //   });

    //   expect(json).toStrictEqual({
    //     id: expect.any(String),
    //     name: validUser.name,
    //     email: validUser.email,
    //     emailVerified: null,
    //     image: null,
    //   });
    // });

    // it("should not be possible to create a new user with an used email", async () => {
    //   const response = await fetch(
    //     "http://localhost:3000/api/v1/user/createUser",
    //     {
    //       method: "POST",
    //       body: JSON.stringify(validUser),
    //     }
    //   );

    //   expect(response.status).toEqual(409);

    //   const json = await response.json();

    //   expect(json).toStrictEqual({
    //     message: "O Email fornecido já está em uso por outro usuário.",
    //     action: "Informe outro email",
    //   });

    //   expect(await userModel.count()).toEqual(1);
    // });
  });
});
