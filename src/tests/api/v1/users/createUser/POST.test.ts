import { describe, it, expect, beforeAll } from "vitest";

import { IEstablishmentFromDB, prisma } from "@/prisma/prisma";

import { userModel } from "@/src/models/user";

// valid entitys for tests
import {
  createValidEstablishment,
  createValidEstablishment2,
  createValidManager,
  createValidManager2,
  IValidManager,
} from "../../../../entitysForTest";
import { signinForTest } from "../../../../signinForTest";
import { cpfUtils } from "@/src/utils/cpf";
import { establishmentModel } from "@/src/models/establishment";

let validManager: IValidManager;
let validManager2: IValidManager;
let validEstablishment2: IEstablishmentFromDB;
let cookie: string;
let cookie2: string;
let validUserData: {
  name: string;
  email: string;
  password: string;
  cpf: string;
  establishmentId: string;
};

beforeAll(async () => {
  await prisma.$queryRawUnsafe(
    `TRUNCATE TABLE "users", "establishments" RESTART IDENTITY CASCADE;`
  );

  validManager = await createValidManager();
  const validEstablishment = await createValidEstablishment(validManager.id);
  const signinResponse = await signinForTest({
    email: validManager.email,
    password: validManager.password,
  });

  cookie = signinResponse.cookies;

  validManager2 = await createValidManager2();
  validEstablishment2 = await createValidEstablishment2(validManager2.id);
  const signinResponse2 = await signinForTest({
    email: validManager2.email,
    password: validManager2.password,
  });

  cookie2 = signinResponse2.cookies;

  validUserData = {
    name: "userName",
    email: "teste@teste.com",
    password: "135792478Abc.",
    cpf: "529.982.247-25",
    establishmentId: validEstablishment.id,
  };

  expect(await userModel.count()).toEqual(2);
});

describe("POST on /api/v1/user/createUser", () => {
  describe("Anonymous user", () => {
    it("should not be possible to access if is not authenticated", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/createUser",
        {
          method: "POST",
          body: JSON.stringify({
            ...validUserData,
          }),
        }
      );
      expect(response.status).toEqual(401);

      const json = await response.json();

      expect(json).toEqual({
        action: "Faça login no site",
        message: "Usuário não autorizado",
      });
    });
  });

  describe("Authenticated user but unauthorized", () => {
    it("should not be possible to access if is not authenticated", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/createUser",
        {
          method: "POST",
          body: JSON.stringify({
            ...validUserData,
            establishmentId: validEstablishment2.id,
          }),
          headers: { cookie },
        }
      );
      expect(response.status).toEqual(403);

      const json = await response.json();

      expect(json).toEqual({
        action: "Contate o suporte.",
        message: "Usuário não tem permissão para fazer essa operação.",
      });

      expect(await userModel.count()).toEqual(2);
    });
  });
  describe("Authenticated user", () => {
    describe("Name tests", () => {
      it("should not be possible to create a new user if name is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/createUser",
          {
            method: "POST",
            body: JSON.stringify({
              ...validUserData,
              name: "",
            }),
            headers: { cookie },
          }
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await userModel.count()).toEqual(2);
      });
    });
    describe("Email tests", () => {
      it("should not be possible to create a new user with invalid email", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/createUser",
          {
            method: "POST",
            body: JSON.stringify({
              ...validUserData,
              email: "test-teste.com",
            }),
            headers: { cookie },
          }
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Email inválido.",
          action:
            "Informe um email válido seguindo a seguinte estrutura: XXXX@XXXX.XXX",
        });
        expect(await userModel.count()).toEqual(2);
      });

      it("should not be possible to create a new user if email is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/createUser",
          {
            method: "POST",
            body: JSON.stringify({
              ...validUserData,
              email: "",
            }),
            headers: { cookie },
          }
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await userModel.count()).toEqual(2);
      });
    });

    describe("Password tests", () => {
      it("should not be possible to create a new user with invalid password", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/createUser",
          {
            method: "POST",
            body: JSON.stringify({
              ...validUserData,
              password: "1234",
            }),
            headers: { cookie },
          }
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Senha inválida.",
          action:
            "Informe uma senha válida, a senha deve conter ao menos uma letra maiúscula um número e um caracter especial.",
        });
        expect(await userModel.count()).toEqual(2);
      });

      it("should not be possible to create a new user if password is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/createUser",
          {
            method: "POST",
            body: JSON.stringify({
              ...validUserData,
              password: "",
            }),
            headers: { cookie },
          }
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await userModel.count()).toEqual(2);
      });
    });

    describe("CPF tests", () => {
      it("should not be possible to create a new user with invalid CPF", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/createUser",
          {
            method: "POST",
            body: JSON.stringify({
              ...validUserData,
              cpf: "529.982.247-26",
            }),
            headers: { cookie },
          }
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "CPF inválido",
          action: "Informe um cpf válido",
        });
        expect(await userModel.count()).toEqual(2);
      });

      it("should not be possible to create a new user if CPF is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/createUser",
          {
            method: "POST",
            body: JSON.stringify({
              ...validUserData,
              password: "",
            }),
            headers: { cookie },
          }
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await userModel.count()).toEqual(2);
      });
    });

    describe("Successful cases", () => {
      it("should be possible to create new user", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/createUser",
          {
            method: "POST",
            body: JSON.stringify(validUserData),
            headers: { cookie },
          }
        );
        expect(response.status).toEqual(201);

        const json = await response.json();

        expect(json).toEqual({
          id: expect.any(String),
          name: validUserData.name,
          email: validUserData.email,
          emailVerified: null,
          image: null,
          cpf: cpfUtils.clean(validUserData.cpf),
        });

        const userFromDB = await userModel.findBy({
          email: validUserData.email,
        });

        if (!userFromDB) throw new Error("Usuário não foi criado");
        expect(userFromDB).toEqual({
          id: expect.any(String),
          name: validUserData.name,
          email: validUserData.email,
          cpf: cpfUtils.clean(validUserData.cpf),
          emailVerified: null,
          image: null,
          hash: expect.any(String),
        });

        const establishmentsFromUser = await establishmentModel.listByWorker({
          workerId: userFromDB.id,
        });

        expect(establishmentsFromUser.length).toEqual(1);
      });

      it("should be possible to associate a existent user to a existent establishment", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/createUser",
          {
            method: "POST",
            body: JSON.stringify({
              ...validUserData,
              establishmentId: validEstablishment2.id,
            }),
            headers: { cookie: cookie2 },
          }
        );
        expect(response.status).toEqual(201);

        const json = await response.json();

        expect(json).toEqual({
          id: expect.any(String),
          name: validUserData.name,
          email: validUserData.email,
          emailVerified: null,
          image: null,
          cpf: cpfUtils.clean(validUserData.cpf),
        });

        const userFromDB = await userModel.findBy({
          email: validUserData.email,
        });

        if (!userFromDB) throw new Error("Usuário não foi criado");
        expect(userFromDB).toEqual({
          id: expect.any(String),
          name: validUserData.name,
          email: validUserData.email,
          cpf: cpfUtils.clean(validUserData.cpf),
          emailVerified: null,
          image: null,
          hash: expect.any(String),
        });

        const establishmentsFromUser = await establishmentModel.listByWorker({
          workerId: userFromDB.id,
        });

        expect(establishmentsFromUser.length).toEqual(2);
      });

      it("should return error if a user is already associated with the establishment", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/createUser",
          {
            method: "POST",
            body: JSON.stringify({
              ...validUserData,
            }),
            headers: { cookie },
          }
        );
        expect(response.status).toEqual(409);

        const json = await response.json();

        expect(json).toEqual({
          action: "Verifique o usuário e o estabelecimento",
          message: "O usuário informado ja está associado ao estabelecimento",
        });
      });
    });
  });
});
