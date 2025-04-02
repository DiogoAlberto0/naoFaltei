import { describe, it, expect, beforeAll } from "vitest";

import { resetAllDatabase } from "@/prisma/prisma";

//models
import { workerModel } from "@/src/app/(back)/models/worker";

// valid entitys for tests
import {
  createScenario1,
  createScenario2,
} from "../../../../tests/entitysForTest";

//utils
import { cpfUtils } from "@/src/utils/cpf";
import { phoneUtils } from "@/src/utils/phone";
import { emailUtils } from "@/src/utils/email";
import { loginUtils } from "@/src/utils/login";

interface IUser {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  login: string;
  password: string;
  establishmentId: string;
}

let author1cookie: string;
let manager1cookie: string;
let establisment1Id: string;

let author2cookie: string;
let manager2cookie: string;
let establisment2Id: string;
let worker2Id: string;

let validNewUser: IUser;
let validNewUser2: IUser;

beforeAll(async () => {
  // resetando banco de dados
  await resetAllDatabase();

  const scenario1 = await createScenario1();
  author1cookie = scenario1.author.cookies;
  manager1cookie = scenario1.manager.cookie;
  establisment1Id = scenario1.establishment.id;

  const scenario2 = await createScenario2();
  author2cookie = scenario2.author.cookies;
  manager2cookie = scenario2.manager.cookie;
  establisment2Id = scenario2.establishment.id;
  worker2Id = scenario2.worker.id;

  validNewUser = {
    name: "userName",
    email: "teste@teste.com",
    phone: "61999999997",
    login: "newUserName@validEstablishment",
    password: "135792478Abc.",
    cpf: "529.982.247-25",
    establishmentId: establisment1Id,
  };

  validNewUser2 = {
    name: "userName2",
    email: "teste2@teste.com",
    phone: "61999999996",
    login: "newUser2Name@validEstablishment2",
    password: "135792478Abc.",
    cpf: "614.169.560-42",
    establishmentId: establisment2Id,
  };
});

const createFetch = async (validNewUser: IUser, cookie?: string) => {
  const response = await fetch("http://localhost:3000/api/v1/worker/create", {
    method: "POST",
    body: JSON.stringify({
      ...validNewUser,
    }),
    headers: cookie
      ? {
          cookie,
        }
      : {},
  });

  const data = await response.json();

  return { response, data };
};

const expectations = async ({
  newUser,
  cookie,
  expectedStatusCode = 201,
  expectedResponseData,
}: {
  newUser: IUser;
  cookie?: string;
  expectedStatusCode?: number;
  expectedResponseData?: any;
}) => {
  const counterBeforeCreate = await workerModel.count();

  const { response, data } = await createFetch(newUser, cookie);

  const counterAfterCreate = await workerModel.count();

  expect(response.status).toStrictEqual(expectedStatusCode);

  if (response.status == 201) {
    expect(data).toEqual({
      id: expect.any(String),
      name: newUser.name,
      email: emailUtils.normalize(newUser.email),
      cpf: cpfUtils.clean(newUser.cpf),
      login: loginUtils.normalize(newUser.login),
      phone: phoneUtils.clean(newUser.phone),
    });

    const createdWorker = await workerModel.findUniqueBy({ id: data.id });

    expect(createdWorker).toStrictEqual({
      id: expect.any(String),
      name: newUser.name,
      email: emailUtils.normalize(newUser.email),
      cpf: cpfUtils.clean(newUser.cpf),
      login: loginUtils.normalize(newUser.login),
      phone: phoneUtils.clean(newUser.phone),
      hash: expect.any(String),
      is_manager: false,
      is_admin: false,
      is_active: true,
      establishment_id: newUser.establishmentId,
    });

    expect(counterAfterCreate).toStrictEqual(counterBeforeCreate + 1);
  } else {
    expect(data).toStrictEqual(expectedResponseData);
    expect(counterAfterCreate).toStrictEqual(counterBeforeCreate);
  }
};
describe("POST on /api/v1/worker/create", () => {
  describe("Anonymous user", () => {
    it("should not be possible to update if is not authenticated", async () => {
      await expectations({
        newUser: validNewUser,
        expectedStatusCode: 401,
        expectedResponseData: {
          action: "Faça login no site",
          message: "Usuário não autorizado",
        },
      });
    });
  });
  describe("Authenticated user but unauthorized", () => {
    it("should not be possible to create if manager is not from establishment", async () => {
      await expectations({
        newUser: validNewUser,
        cookie: manager2cookie,
        expectedStatusCode: 403,
        expectedResponseData: {
          action: "Contate o suporte.",
          message: "Usuário não tem permissão para fazer essa operação.",
        },
      });
    });
  });
  describe("Authenticated manager", () => {
    describe("Name tests", () => {
      it("should not be possible to create a new user if name is not provided", async () => {
        await expectations({
          newUser: { ...validNewUser, name: "" },
          cookie: manager1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Campos obrigatórios faltando.",
            action:
              "Informe nome, email, cpf, senha e o estabelecimento do usuário",
          },
        });
      });
    });
    describe("Email tests", () => {
      it("should not be possible to create a new user with invalid email", async () => {
        await expectations({
          newUser: { ...validNewUser, email: "test-teste.com" },
          cookie: manager1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Email inválido",
            action: "Informe o email com a seguinte estrutura XXXX@XXXX.XXX",
          },
        });
      });
      it("should not be possible to create a new user if email is not provided", async () => {
        await expectations({
          newUser: { ...validNewUser, email: "" },
          cookie: manager1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Campos obrigatórios faltando.",
            action:
              "Informe nome, email, cpf, senha e o estabelecimento do usuário",
          },
        });
      });
    });
    describe("Password tests", () => {
      it("should not be possible to create a new user with invalid password", async () => {
        await expectations({
          newUser: { ...validNewUser, password: "1234" },
          cookie: manager1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Senha inválida",
            action:
              "Informe uma senha válida, a senha deve conter ao menos uma letra maiúscula um número e um caracter especial.",
          },
        });
      });
      it("should not be possible to create a new user if password is not provided", async () => {
        await expectations({
          newUser: { ...validNewUser, password: "" },
          cookie: manager1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Campos obrigatórios faltando.",
            action:
              "Informe nome, email, cpf, senha e o estabelecimento do usuário",
          },
        });
      });
    });
    describe("CPF tests", () => {
      it("should not be possible to create a new user with invalid CPF", async () => {
        await expectations({
          newUser: { ...validNewUser, cpf: "529.982.247-26" },
          cookie: manager1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "CPF Inválido",
            action: "O CPF deve seguir a seguinte estrutura XXX.XXX.XXX-XX",
          },
        });
      });
      it("should not be possible to create a new user if CPF is not provided", async () => {
        await expectations({
          newUser: { ...validNewUser, cpf: "" },
          cookie: manager1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Campos obrigatórios faltando.",
            action:
              "Informe nome, email, cpf, senha e o estabelecimento do usuário",
          },
        });
      });
    });

    describe("Phone tests", () => {
      it("should not be possible to create a new user with invalid phone", async () => {
        await expectations({
          newUser: { ...validNewUser, phone: "619999999" },
          cookie: manager1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "Informe o telefone com a seguinte estrutura (XX)XXXXX-XXXX",
            message: "Número de telefone inválido",
          },
        });
      });
      it("should not be possible to create a new user if phone is not provided", async () => {
        await expectations({
          newUser: { ...validNewUser, phone: "" },
          cookie: manager1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Campos obrigatórios faltando.",
            action:
              "Informe nome, email, cpf, senha e o estabelecimento do usuário",
          },
        });
      });
    });

    describe("Successful cases", () => {
      it("should be possible to create new user", async () => {
        await expectations({
          newUser: { ...validNewUser },
          cookie: manager1cookie,
        });
      });
    });

    describe("Login tests", () => {
      it("should not be possible to create a new user if login is already in use", async () => {
        const usedLogin = (await workerModel.findUniqueBy({ id: worker2Id }))
          ?.login;
        if (!usedLogin) throw new Error("used login tests error");
        await expectations({
          newUser: { ...validNewUser, login: usedLogin || "" },
          cookie: manager1cookie,
          expectedStatusCode: 409,
          expectedResponseData: {
            message: "O login informado ja está em uso por outro funcionário.",
            action: "Informe outro login",
          },
        });
      });

      it("should not be possible to create a new user if invalid login is provided", async () => {
        await expectations({
          newUser: { ...validNewUser, login: "invalidLogin" },
          cookie: manager1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "Informe o login com a seguinte estrutura: NomeDoFuncionário@NomeDaEmpresa",
            message: "Login inválido",
          },
        });
      });
    });
  });
  describe("Authenticated author", () => {
    describe("Name tests", () => {
      it("should not be possible to create a new user if name is not provided", async () => {
        await expectations({
          newUser: { ...validNewUser, name: "" },
          cookie: author1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Campos obrigatórios faltando.",
            action:
              "Informe nome, email, cpf, senha e o estabelecimento do usuário",
          },
        });
      });
    });
    describe("Email tests", () => {
      it("should not be possible to create a new user with invalid email", async () => {
        await expectations({
          newUser: { ...validNewUser, email: "test-teste.com" },
          cookie: author1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Email inválido",
            action: "Informe o email com a seguinte estrutura XXXX@XXXX.XXX",
          },
        });
      });
      it("should not be possible to create a new user if email is not provided", async () => {
        await expectations({
          newUser: { ...validNewUser, email: "" },
          cookie: author1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Campos obrigatórios faltando.",
            action:
              "Informe nome, email, cpf, senha e o estabelecimento do usuário",
          },
        });
      });
    });
    describe("Password tests", () => {
      it("should not be possible to create a new user with invalid password", async () => {
        await expectations({
          newUser: { ...validNewUser, password: "1234" },
          cookie: author1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Senha inválida",
            action:
              "Informe uma senha válida, a senha deve conter ao menos uma letra maiúscula um número e um caracter especial.",
          },
        });
      });
      it("should not be possible to create a new user if password is not provided", async () => {
        await expectations({
          newUser: { ...validNewUser, password: "" },
          cookie: author1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Campos obrigatórios faltando.",
            action:
              "Informe nome, email, cpf, senha e o estabelecimento do usuário",
          },
        });
      });
    });
    describe("CPF tests", () => {
      it("should not be possible to create a new user with invalid CPF", async () => {
        await expectations({
          newUser: { ...validNewUser, cpf: "529.982.247-26" },
          cookie: author1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "CPF Inválido",
            action: "O CPF deve seguir a seguinte estrutura XXX.XXX.XXX-XX",
          },
        });
      });
      it("should not be possible to create a new user if CPF is not provided", async () => {
        await expectations({
          newUser: { ...validNewUser, cpf: "" },
          cookie: author1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Campos obrigatórios faltando.",
            action:
              "Informe nome, email, cpf, senha e o estabelecimento do usuário",
          },
        });
      });
    });

    describe("Phone tests", () => {
      it("should not be possible to create a new user with invalid phone", async () => {
        await expectations({
          newUser: { ...validNewUser, phone: "619999999" },
          cookie: author1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "Informe o telefone com a seguinte estrutura (XX)XXXXX-XXXX",
            message: "Número de telefone inválido",
          },
        });
      });
      it("should not be possible to create a new user if phone is not provided", async () => {
        await expectations({
          newUser: { ...validNewUser, phone: "" },
          cookie: author1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Campos obrigatórios faltando.",
            action:
              "Informe nome, email, cpf, senha e o estabelecimento do usuário",
          },
        });
      });
    });

    describe("Successful cases", () => {
      it("should be possible to create new user", async () => {
        await expectations({
          newUser: validNewUser2,
          cookie: author2cookie,
        });
      });
    });

    describe("Login tests", () => {
      it("should not be possible to create a new user if login is already in use", async () => {
        const usedLogin = (await workerModel.findUniqueBy({ id: worker2Id }))
          ?.login;
        await expectations({
          newUser: { ...validNewUser, login: usedLogin || "" },
          cookie: author1cookie,
          expectedStatusCode: 409,
          expectedResponseData: {
            message: "O login informado ja está em uso por outro funcionário.",
            action: "Informe outro login",
          },
        });
      });

      it("should not be possible to create a new user if invalid login is provided", async () => {
        await expectations({
          newUser: { ...validNewUser, login: "invalidLogin" },
          cookie: author1cookie,
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "Informe o login com a seguinte estrutura: NomeDoFuncionário@NomeDaEmpresa",
            message: "Login inválido",
          },
        });
      });
    });
  });
});
