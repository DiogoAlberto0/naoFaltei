import { describe, it, expect, beforeAll } from "vitest";

import { IEstablishmentFromDB, prisma } from "@/prisma/prisma";

//models
import { userModel } from "@/src/app/(back)/models/user";
import { workerModel } from "@/src/app/(back)/models/worker";

// valid entitys for tests
import {
  createValidEstablishment,
  createValidEstablishment2,
  createValidAutho,
  createValidManager,
  IValidManager,
} from "../../../../tests/entitysForTest";
import { signinForTest } from "../../../../tests/signinForTest";

//utils
import { cpfUtils } from "@/src/utils/cpf";
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { phoneUtils } from "@/src/utils/phone";
import { emailUtils } from "@/src/utils/email";
import { loginUtils } from "@/src/utils/login";

let authorCookies: string;

let validManager: IValidManager;
let validManagerCookies: string;
let validEstablishment: IEstablishmentFromDB;

let validEstablishment2: IEstablishmentFromDB;

// let validManager2: IValidManager;
// let validEstablishment2: IEstablishmentFromDB;
// let cookie2: string;

interface IUser {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  login: string;
  password: string;
  establishmentId: string;
}
let validNewUser: IUser;
let validNewUser2: IUser;

beforeAll(async () => {
  // resetando banco de dados
  await prisma.$queryRawUnsafe(
    `TRUNCATE TABLE "users", "establishments", "workers" RESTART IDENTITY CASCADE;`,
  );

  // criando um author
  const establishmentCreator = await createValidAutho();
  const { cookies: aCookies } = await signinForTest({
    login: establishmentCreator.email,
    password: establishmentCreator.password,
  });
  authorCookies = aCookies;
  expect(await userModel.count()).toEqual(1);

  //Criando um estabelecimento, um gerente, e logando esse gerente criado
  validEstablishment = await createValidEstablishment(establishmentCreator.id);

  validManager = await createValidManager(validEstablishment.id);
  const { cookies } = await signinForTest({
    login: validManager.login,
    password: validManager.password,
  });
  validManagerCookies = cookies;

  expect(await workerModel.count()).toEqual(1);
  expect(await establishmentModel.count()).toEqual(1);

  //Criando outro estabelecimento, outro gerente, e logando esse gerente criado
  validEstablishment2 = await createValidEstablishment2(
    establishmentCreator.id,
  );

  expect(await establishmentModel.count()).toEqual(2);

  validNewUser = {
    name: "userName",
    email: "teste@teste.com",
    phone: "61999999997",
    login: "newUserName@validEstablishment",
    password: "135792478Abc.",
    cpf: "529.982.247-25",
    establishmentId: validEstablishment.id,
  };

  validNewUser2 = {
    name: "userName2",
    email: "teste2@teste.com",
    phone: "61999999996",
    login: "newUser2Name@validEstablishment2",
    password: "135792478Abc.",
    cpf: "614.169.560-42",
    establishmentId: validEstablishment2.id,
  };
});

describe("POST on /api/v1/worker/create", () => {
  describe("Anonymous user", () => {
    it("should not be possible to update if is not authenticated", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/worker/create",
        {
          method: "POST",
          body: JSON.stringify({
            ...validNewUser,
          }),
        },
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
    it("should not be possible to create if manager is not from establishment", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/worker/create",
        {
          method: "POST",
          body: JSON.stringify({
            ...validNewUser,
            establishmentId: validEstablishment2.id,
          }),
          headers: { cookie: validManagerCookies },
        },
      );
      const json = await response.json();

      expect(response.status).toEqual(403);
      expect(json).toEqual({
        action: "Contate o suporte.",
        message: "Usuário não tem permissão para fazer essa operação.",
      });
      expect(await workerModel.count()).toEqual(1);
    });
  });
  describe("Authenticated manager", () => {
    describe("Name tests", () => {
      it("should not be possible to create a new user if name is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
              name: "",
            }),
            headers: { cookie: validManagerCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await workerModel.count()).toEqual(1);
      });
    });
    describe("Email tests", () => {
      it("should not be possible to create a new user with invalid email", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
              email: "test-teste.com",
            }),
            headers: { cookie: validManagerCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Email inválido",
          action: "Informe o email com a seguinte estrutura XXXX@XXXX.XXX",
        });
        expect(await workerModel.count()).toEqual(1);
      });
      it("should not be possible to create a new user if email is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
              email: "",
            }),
            headers: { cookie: validManagerCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await workerModel.count()).toEqual(1);
      });
    });
    describe("Password tests", () => {
      it("should not be possible to create a new user with invalid password", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
              password: "1234",
            }),
            headers: { cookie: validManagerCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Senha inválida",
          action:
            "Informe uma senha válida, a senha deve conter ao menos uma letra maiúscula um número e um caracter especial.",
        });
        expect(await workerModel.count()).toEqual(1);
      });
      it("should not be possible to create a new user if password is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
              password: "",
            }),
            headers: { cookie: validManagerCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await workerModel.count()).toEqual(1);
      });
    });
    describe("CPF tests", () => {
      it("should not be possible to create a new user with invalid CPF", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
              cpf: "529.982.247-26",
            }),
            headers: { cookie: validManagerCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "CPF Inválido",
          action: "O CPF deve seguir a seguinte estrutura XXX.XXX.XXX-XX",
        });
        expect(await workerModel.count()).toEqual(1);
      });
      it("should not be possible to create a new user if CPF is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
              password: "",
            }),
            headers: { cookie: validManagerCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await workerModel.count()).toEqual(1);
      });
    });

    describe("Phone tests", () => {
      it("should not be possible to create a new user with invalid phone", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
              phone: "619999999",
            }),
            headers: { cookie: validManagerCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          action: "Informe o telefone com a seguinte estrutura (XX)XXXXX-XXXX",
          message: "Número de telefone inválido",
        });
        expect(await workerModel.count()).toEqual(1);
      });
      it("should not be possible to create a new user if phone is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
              phone: "",
            }),
            headers: { cookie: validManagerCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await workerModel.count()).toEqual(1);
      });
    });

    describe("Successful cases", () => {
      it("should be possible to create new user", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify(validNewUser),
            headers: { cookie: validManagerCookies },
          },
        );
        expect(response.status).toEqual(201);
        const json = await response.json();
        expect(json).toEqual({
          id: expect.any(String),
          name: validNewUser.name,
          email: emailUtils.normalize(validNewUser.email),
          cpf: cpfUtils.clean(validNewUser.cpf),
          login: loginUtils.normalize(validNewUser.login),
        });
        const userFromDB = await workerModel.findUniqueBy({
          login: validNewUser.login,
        });
        if (!userFromDB) throw new Error("Usuário não foi criado");
        expect(userFromDB).toEqual({
          id: expect.any(String),
          name: validNewUser.name,
          email: emailUtils.normalize(validNewUser.email),
          cpf: cpfUtils.clean(validNewUser.cpf),
          phone: phoneUtils.clean(validNewUser.phone),
          is_admin: false,
          is_manager: false,
          login: loginUtils.normalize(validNewUser.login),
          establishment_id: validNewUser.establishmentId,
          hash: expect.any(String),
        });
      });
    });

    describe("Login tests", () => {
      it("should not be possible to create a new user if login is already in use", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
            }),
            headers: { cookie: validManagerCookies },
          },
        );
        const json = await response.json();
        expect(response.status).toEqual(409);

        expect(json).toStrictEqual({
          message: "O login informado ja está em uso por outro funcionário.",
          action: "Informe outro login",
        });
        expect(await workerModel.count()).toEqual(2);
      });

      it("should not be possible to create a new user if invalid login is provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
            }),
            headers: { cookie: validManagerCookies },
          },
        );
        const json = await response.json();
        expect(response.status).toEqual(409);

        expect(json).toStrictEqual({
          message: "O login informado ja está em uso por outro funcionário.",
          action: "Informe outro login",
        });
        expect(await workerModel.count()).toEqual(2);
      });
    });
  });
  describe("Authenticated author", () => {
    describe("Name tests", () => {
      it("should not be possible to create a new user if name is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser2,
              name: "",
            }),
            headers: { cookie: authorCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await workerModel.count()).toEqual(2);
      });
    });
    describe("Email tests", () => {
      it("should not be possible to create a new user with invalid email", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser2,
              email: "test-teste.com",
            }),
            headers: { cookie: authorCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Email inválido",
          action: "Informe o email com a seguinte estrutura XXXX@XXXX.XXX",
        });
        expect(await workerModel.count()).toEqual(2);
      });
      it("should not be possible to create a new user if email is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser2,
              email: "",
            }),
            headers: { cookie: authorCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await workerModel.count()).toEqual(2);
      });
    });
    describe("Password tests", () => {
      it("should not be possible to create a new user with invalid password", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser2,
              password: "1234",
            }),
            headers: { cookie: authorCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Senha inválida",
          action:
            "Informe uma senha válida, a senha deve conter ao menos uma letra maiúscula um número e um caracter especial.",
        });
        expect(await workerModel.count()).toEqual(2);
      });
      it("should not be possible to create a new user if password is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser2,
              password: "",
            }),
            headers: { cookie: authorCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await workerModel.count()).toEqual(2);
      });
    });
    describe("CPF tests", () => {
      it("should not be possible to create a new user with invalid CPF", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser2,
              cpf: "529.982.247-26",
            }),
            headers: { cookie: authorCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "CPF Inválido",
          action: "O CPF deve seguir a seguinte estrutura XXX.XXX.XXX-XX",
        });
        expect(await workerModel.count()).toEqual(2);
      });
      it("should not be possible to create a new user if CPF is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser2,
              password: "",
            }),
            headers: { cookie: authorCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await workerModel.count()).toEqual(2);
      });
    });

    describe("Phone tests", () => {
      it("should not be possible to create a new user with invalid phone", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser2,
              phone: "619999999",
            }),
            headers: { cookie: authorCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          action: "Informe o telefone com a seguinte estrutura (XX)XXXXX-XXXX",
          message: "Número de telefone inválido",
        });
        expect(await workerModel.count()).toEqual(2);
      });
      it("should not be possible to create a new user if phone is not provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser2,
              phone: "",
            }),
            headers: { cookie: authorCookies },
          },
        );
        expect(response.status).toEqual(400);
        const json = await response.json();
        expect(json).toStrictEqual({
          message: "Campos obrigatórios faltando.",
          action:
            "Informe nome, email, cpf, senha e o estabelecimento do usuário",
        });
        expect(await workerModel.count()).toEqual(2);
      });
    });

    describe("Successful cases", () => {
      it("should be possible to create new user", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify(validNewUser2),
            headers: { cookie: authorCookies },
          },
        );
        expect(response.status).toEqual(201);
        const json = await response.json();

        expect(json).toStrictEqual({
          id: expect.any(String),
          name: validNewUser2.name,
          email: emailUtils.normalize(validNewUser2.email),
          cpf: cpfUtils.clean(validNewUser2.cpf),
          login: loginUtils.normalize(validNewUser2.login),
        });
        const userFromDB = await workerModel.findUniqueBy({
          login: validNewUser2.login,
        });
        if (!userFromDB) throw new Error("Usuário não foi criado");
        expect(userFromDB).toEqual({
          id: expect.any(String),
          name: validNewUser2.name,
          email: emailUtils.normalize(validNewUser2.email),
          cpf: cpfUtils.clean(validNewUser2.cpf),
          phone: phoneUtils.clean(validNewUser2.phone),
          is_admin: false,
          is_manager: false,
          login: loginUtils.normalize(validNewUser2.login),
          establishment_id: validNewUser2.establishmentId,
          hash: expect.any(String),
        });

        expect(await workerModel.count()).toEqual(3);
      });
    });

    describe("Login tests", () => {
      it("should not be possible to create a new user if login is already in use", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
            }),
            headers: { cookie: authorCookies },
          },
        );
        const json = await response.json();

        console.log(json);
        expect(response.status).toEqual(409);

        expect(json).toStrictEqual({
          message: "O login informado ja está em uso por outro funcionário.",
          action: "Informe outro login",
        });
        expect(await workerModel.count()).toEqual(3);
      });

      it("should not be possible to create a new user if invalid login is provided", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/worker/create",
          {
            method: "POST",
            body: JSON.stringify({
              ...validNewUser,
            }),
            headers: { cookie: authorCookies },
          },
        );
        const json = await response.json();
        expect(response.status).toEqual(409);

        expect(json).toStrictEqual({
          message: "O login informado ja está em uso por outro funcionário.",
          action: "Informe outro login",
        });
        expect(await workerModel.count()).toEqual(3);
      });
    });
  });
});
