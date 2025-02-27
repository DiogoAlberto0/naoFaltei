import { describe, it, expect, beforeAll } from "vitest";

import { prisma } from "@/prisma/prisma";

import { findUserByEmail } from "@/model/user";

const userCounter = async () => {
  return await prisma.user.count();
};

beforeAll(async () => {
  await prisma.$queryRawUnsafe(
    `TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;`
  );

  expect(await userCounter()).toEqual(0);
});

const validUser = {
  email: "teste@teste.com",
  password: "135792478Abc.",
  name: "userName",
};

describe("POST on /api/v1/user/createUser", () => {
  describe("Anonymous user", () => {
    it("should not be possible to create a new user if name is not provided", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/createUser",
        {
          method: "POST",
          body: JSON.stringify({
            ...validUser,
            name: "",
          }),
        }
      );

      expect(response.status).toEqual(400);

      const json = await response.json();

      expect(json).toStrictEqual({
        message: "Informe o nome do usuário",
      });

      expect(await userCounter()).toEqual(0);
    });
    it("should not be possible to create a new user with invalid email", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/createUser",
        {
          method: "POST",
          body: JSON.stringify({
            ...validUser,
            email: "test-teste.com",
          }),
        }
      );

      expect(response.status).toEqual(400);

      const json = await response.json();

      expect(json).toStrictEqual({
        message: "Informe um email válido",
      });

      expect(await userCounter()).toEqual(0);
    });

    it("should not be possible to create a new user if email is not provided", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/createUser",
        {
          method: "POST",
          body: JSON.stringify({
            ...validUser,
            email: "",
          }),
        }
      );

      expect(response.status).toEqual(400);

      const json = await response.json();

      expect(json).toStrictEqual({
        message: "Informe um email válido",
      });

      expect(await userCounter()).toEqual(0);
    });

    it("should not be possible to create a new user with invalid password", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/createUser",
        {
          method: "POST",
          body: JSON.stringify({
            ...validUser,
            password: "1234",
          }),
        }
      );

      expect(response.status).toEqual(400);

      const json = await response.json();

      expect(json).toStrictEqual({
        message:
          "A senha deve conter pelomenos uma letra maiuscula e um caracter especial",
      });

      expect(await userCounter()).toEqual(0);
    });

    it("should not be possible to create a new user if password is not provided", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/createUser",
        {
          method: "POST",
          body: JSON.stringify({
            ...validUser,
            password: "",
          }),
        }
      );

      expect(response.status).toEqual(400);

      const json = await response.json();

      expect(json).toStrictEqual({
        message:
          "A senha deve conter pelomenos uma letra maiuscula e um caracter especial",
      });

      expect(await userCounter()).toEqual(0);
    });

    it("should be possible to create new user", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/createUser",
        {
          method: "POST",
          body: JSON.stringify(validUser),
        }
      );

      expect(response.status).toEqual(201);

      const json = await response.json();

      expect(json).toStrictEqual({
        message: "Usuário criado com sucesso!",
      });

      const userFromDB = await findUserByEmail(validUser.email);

      expect(userFromDB).toEqual({
        id: expect.any(String),
        name: validUser.name,
        email: validUser.email,
        emailVerified: null,
        image: null,
        hash: expect.any(String),
      });
    });

    it("should not be possible to create a new user with an used email", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/createUser",
        {
          method: "POST",
          body: JSON.stringify(validUser),
        }
      );

      expect(response.status).toEqual(409);

      const json = await response.json();

      expect(json).toStrictEqual({
        message: "Este email já está em uso por outro usuário",
      });

      expect(await userCounter()).toEqual(1);
    });
  });
});
