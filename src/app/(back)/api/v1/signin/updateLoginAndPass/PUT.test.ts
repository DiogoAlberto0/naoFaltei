import { resetAllDatabase } from "@/prisma/prisma";
import { workerModel } from "@/src/app/(back)/models/worker/worker";
import {
  createScenario1,
  createScenario2,
} from "@/src/app/(back)/tests/entitysForTest";
import { loginUtils } from "@/src/utils/login";
import { passwordUtils } from "@/src/utils/password";
import { describe, it, expect, beforeAll } from "vitest";

let worker1Cookie: string;
let worker1Id: string;
let manager1Cookie: string;
let manager1Id: string;

let worker2Id: string;

beforeAll(async () => {
  await resetAllDatabase();

  const scenario1 = await createScenario1();
  worker1Cookie = scenario1.worker.cookie;
  worker1Id = scenario1.worker.id;
  manager1Cookie = scenario1.manager.cookie;
  manager1Id = scenario1.manager.id;

  const scenario2 = await createScenario2();
  worker2Id = scenario2.worker.id;
});

const updateLoginAndPassFetch = async (
  cookie: string,
  body: {
    login: string;
    password: string;
  },
) => {
  const response = await fetch(
    "http://localhost:3000/api/v1/signin/updateLoginAndPass",
    {
      method: "PUT",
      headers: {
        cookie,
      },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();
  return { response, data };
};

const expectations = async ({
  cookie,
  workerId,
  newLogin,
  newPassword,
  expctedStatusCode = 200,
  expectedResponseData,
}: {
  cookie: string;
  workerId: string;
  newLogin: string;
  newPassword: string;
  expctedStatusCode?: number;
  expectedResponseData?: any;
}) => {
  const workerBeforeUpdate = await workerModel.findUniqueBy({ id: workerId });
  if (!workerBeforeUpdate) throw new Error("Funcionário não encontrado");
  const { response, data } = await updateLoginAndPassFetch(cookie, {
    login: newLogin,
    password: newPassword,
  });
  const workerAfterUpdate = await workerModel.findUniqueBy({ id: workerId });
  if (!workerAfterUpdate) throw new Error("Funcionário não encontrado");

  expect(response.status).toStrictEqual(expctedStatusCode);

  if (response.status == 200) {
    expect(data).toStrictEqual({});
    expect(workerAfterUpdate.login).toStrictEqual(
      loginUtils.normalize(newLogin),
    );
    expect(
      passwordUtils.comparePassAndHash(newPassword, workerAfterUpdate.hash),
    ).toBeTruthy();
  } else {
    expect(data).toStrictEqual(expectedResponseData);
    expect(workerAfterUpdate).toStrictEqual(workerBeforeUpdate);
  }
};
describe("PUT on `/api/v1/signin/updatePhoneAndPass", () => {
  describe("Auhtenticated worker", () => {
    it("shoud be possible to update if valid login and password is provided", async () => {
      await expectations({
        cookie: worker1Cookie,
        newLogin: "newLoginWorker@establishment1",
        newPassword: "135792468Abc.",
        workerId: worker1Id,
      });
    });

    it("shoud be possible to update if provided login is already in use by the same worker", async () => {
      const usedLogin = (await workerModel.findUniqueBy({ id: worker1Id }))
        ?.login;
      if (!usedLogin) throw new Error("Authenticated worker login tests error");

      await expectations({
        cookie: worker1Cookie,
        newLogin: usedLogin,
        newPassword: "135792468Abc.",
        workerId: worker1Id,
      });
    });

    it("shoud not be possible to update if login is alrady in use by another worker", async () => {
      const usedLogin = (await workerModel.findUniqueBy({ id: worker2Id }))
        ?.login;
      if (!usedLogin) throw new Error("Authenticated worker login tests error");

      await expectations({
        cookie: worker1Cookie,
        newLogin: usedLogin,
        newPassword: "135792468Abc.",
        workerId: worker1Id,
        expctedStatusCode: 409,
        expectedResponseData: {
          action: "Informe outro login",
          message: "O Login informado já está em uso por outro funcionário",
        },
      });
    });

    it("shoud not be possible to update if invalid login is provided", async () => {
      await expectations({
        cookie: worker1Cookie,
        newLogin: "newLogin",
        newPassword: "135792468Abc.",
        workerId: worker1Id,
        expctedStatusCode: 400,
        expectedResponseData: {
          action:
            "Informe o login com a seguinte estrutura: NomeDoFuncionário@NomeDaEmpresa",
          message: "Login inválido",
        },
      });
    });

    it("shoud not be possible to update if invalid password is provided", async () => {
      await expectations({
        cookie: worker1Cookie,
        newLogin: "newLoginWorker@establishment1",
        newPassword: "135792468",
        workerId: worker1Id,
        expctedStatusCode: 400,
        expectedResponseData: {
          action:
            "Informe uma senha válida, a senha deve conter ao menos uma letra maiúscula um número e um caracter especial.",
          message: "Senha inválida",
        },
      });
    });
  });
  describe("Auhtenticated manager", () => {
    it("shoud be possible to update if valid login and password is provided", async () => {
      await expectations({
        cookie: manager1Cookie,
        newLogin: "newLoginManager@establishment1",
        newPassword: "135792468Abc.",
        workerId: manager1Id,
      });
    });

    it("shoud be possible to update if provided login is already in use by the same worker", async () => {
      const usedLogin = (await workerModel.findUniqueBy({ id: manager1Id }))
        ?.login;
      if (!usedLogin) throw new Error("Authenticated worker login tests error");

      await expectations({
        cookie: manager1Cookie,
        newLogin: usedLogin,
        newPassword: "135792468Abc.",
        workerId: manager1Id,
      });
    });

    it("shoud not be possible to update if login is alrady in use by another worker", async () => {
      const usedLogin = (await workerModel.findUniqueBy({ id: worker2Id }))
        ?.login;
      if (!usedLogin) throw new Error("Authenticated worker login tests error");

      await expectations({
        cookie: manager1Cookie,
        newLogin: usedLogin,
        newPassword: "135792468Abc.",
        workerId: manager1Id,
        expctedStatusCode: 409,
        expectedResponseData: {
          action: "Informe outro login",
          message: "O Login informado já está em uso por outro funcionário",
        },
      });
    });

    it("shoud not be possible to update if invalid login is provided", async () => {
      await expectations({
        cookie: manager1Cookie,
        newLogin: "newLogin",
        newPassword: "135792468Abc.",
        workerId: manager1Id,
        expctedStatusCode: 400,
        expectedResponseData: {
          action:
            "Informe o login com a seguinte estrutura: NomeDoFuncionário@NomeDaEmpresa",
          message: "Login inválido",
        },
      });
    });

    it("shoud not be possible to update if invalid password is provided", async () => {
      await expectations({
        cookie: manager1Cookie,
        newLogin: "newLoginManager@establishment1",
        newPassword: "135792468",
        workerId: manager1Id,
        expctedStatusCode: 400,
        expectedResponseData: {
          action:
            "Informe uma senha válida, a senha deve conter ao menos uma letra maiúscula um número e um caracter especial.",
          message: "Senha inválida",
        },
      });
    });
  });

  describe("Anonymous user", () => {
    it("should be return error if cookie is not provided", async () => {
      await expectations({
        cookie: "",
        newLogin: "validNewLogin@establishment",
        newPassword: "123456789Abc.",
        workerId: worker1Id,
        expctedStatusCode: 401,
        expectedResponseData: {
          action: "Faça login no site",
          message: "Usuário não autorizado",
        },
      });
    });
    it("should be return error if invalid cookie is provided", async () => {
      await expectations({
        cookie:
          "session=eyJ1c2VySWQiOiIxMjM0NTYifQ==; Path=/; HttpOnly; Secure",
        newLogin: "validNewLogin@establishment",
        newPassword: "123456789Abc.",
        workerId: worker1Id,
        expctedStatusCode: 401,
        expectedResponseData: {
          action: "Faça login no site",
          message: "Usuário não autorizado",
        },
      });
    });
  });
});
