import { describe, it, expect, beforeAll } from "vitest";
import { omit } from "lodash";

import { resetAllDatabase } from "@/prisma/prisma";

//models
import { workerModel } from "@/src/app/(back)/models/worker";

//valid entitys from test
import {
  createScenario1,
  createScenario2,
} from "@/src/app/(back)/tests/entitysForTest";

//utils
import { emailUtils } from "@/src/utils/email";
import { loginUtils } from "@/src/utils/login";
import { cpfUtils } from "@/src/utils/cpf";
import { passwordUtils } from "@/src/utils/password";
import { phoneUtils } from "@/src/utils/phone";

let author1Cookie: string;
let manager1Cookie: string;
let worker1Id: string;
let worker1Cookie: string;

let author2Cookie: string;
let manager2Cookie: string;
let worker2Id: string;

beforeAll(async () => {
  await resetAllDatabase();

  const scenario1 = await createScenario1();
  worker1Id = scenario1.worker.id;
  worker1Cookie = scenario1.worker.cookie;
  manager1Cookie = scenario1.manager.cookie;
  author1Cookie = scenario1.author.cookies;

  const scenario2 = await createScenario2();
  author2Cookie = scenario2.author.cookies;
  manager2Cookie = scenario2.manager.cookie;
  worker2Id = scenario2.worker.id;
});

interface IUpdateFields {
  name?: string;
  phone?: string;
  email?: string;
  cpf?: string;
  login?: string;
  password?: string;
  is_manager?: boolean;
}
interface IUpdateFetch extends IUpdateFields {
  workerId: string;
  cookie: string;
}
const updateFetch = async ({
  workerId,
  cookie,
  ...otherParams
}: IUpdateFetch) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/worker/${workerId}/update`,
    {
      method: "PUT",
      headers: { cookie },
      body: JSON.stringify({ ...otherParams }),
    },
  );

  const data = await response.json();

  return { response, data };
};

interface IExpectations {
  workerId: string;
  cookie: string;
  updatePayload?: IUpdateFields;
  expectedStatusCode: number;
  expectedResponseData?: any;
  expectedUpdatedData?: IUpdateFields;
}
const expectations = async ({
  workerId,
  cookie,
  expectedStatusCode,
  expectedResponseData,
  updatePayload,
  expectedUpdatedData,
}: IExpectations) => {
  const oldWorkerData = await workerModel.findUniqueBy({ id: workerId });
  const sanitizedOldData = omit(oldWorkerData, "hash", "created_at");

  const { response, data } = await updateFetch({
    workerId,
    cookie,
    ...updatePayload,
  });

  expect(response.status).toStrictEqual(expectedStatusCode);

  const expectedFinalResponse = expectedUpdatedData ?? updatePayload;
  expect(omit(data, "created_at")).toStrictEqual(
    expectedResponseData || { ...sanitizedOldData, ...expectedFinalResponse },
  );

  expect(new Date(data.created_at)).not.toBeNaN();

  const newWorkerData = await workerModel.findUniqueBy({ id: workerId });
  const sanitizedNewData = omit(newWorkerData, "hash", "created_at");

  const expectedFinalData = expectedUpdatedData ?? updatePayload;

  if (response.status === 200) {
    expect(sanitizedNewData).toStrictEqual({
      ...sanitizedOldData,
      ...expectedFinalData,
    });

    expect(oldWorkerData?.created_at).toStrictEqual(newWorkerData?.created_at);
  } else {
    expect(sanitizedNewData).toStrictEqual(sanitizedOldData);
  }
};

describe("PUT on `/api/v1/worker/:workerId/update", () => {
  describe("Anonymous user", () => {
    it("shoud return error if cookies is not provided", async () => {
      const { response, data } = await updateFetch({
        workerId: worker1Id,
        cookie: "",
      });

      expect(response.status).toStrictEqual(401);
      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });

    it("shoud return error if invalid cookie is provided", async () => {
      const { response, data } = await updateFetch({
        workerId: worker1Id,
        cookie:
          "next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTIzNDU2IiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImltYWdlIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIucG5nIn0sImV4cGlyZXMiOiIyMDI1LTA0LTAxVDAwOjAwOjAwLjAwMFoifQ.WUqvMbW7vXz5h-4BjT_UZVCg1dFgGyNp4z_RLQoTjUo; Path=/; HttpOnly; Secure; SameSite=Lax",
      });

      expect(response.status).toStrictEqual(401);
      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });
  });

  describe("Authenticated manager not from establishment", () => {
    it("shoud return error if authenticated manager is not from establishment", async () => {
      const { response, data } = await updateFetch({
        workerId: worker1Id,
        cookie: manager2Cookie,
      });

      expect(response.status).toStrictEqual(403);
      expect(data).toStrictEqual({
        action: "Contate o suporte.",
        message: "Usuário não tem permissão para fazer essa operação.",
      });
    });
  });
  describe("Authenticated manager from establishment", () => {
    const authenticatedManagerexpectations = async ({
      expectedStatusCode = 200,
      updatePayload,
      expectedUpdatedData,
      expectedResponseData,
    }: {
      expectedStatusCode?: number;
      updatePayload?: IUpdateFields;
      expectedUpdatedData?: IUpdateFields;
      expectedResponseData?: any;
    }) => {
      await expectations({
        workerId: worker1Id,
        cookie: manager1Cookie,
        expectedStatusCode,
        updatePayload,
        expectedResponseData,
        expectedUpdatedData,
      });
    };
    describe("NAME TEST", () => {
      it("should be possible to update name of a valid worker", async () => {
        const newName = "New Name Valid Worker";
        await authenticatedManagerexpectations({
          updatePayload: { name: newName },
        });
      });
    });
    describe("PHONE TEST", () => {
      it("should be possible to update valid phone with ponctuation of a valid worker", async () => {
        const newPhone = "(61)99999-9988";
        await authenticatedManagerexpectations({
          updatePayload: { phone: newPhone },
          expectedUpdatedData: { phone: phoneUtils.clean(newPhone) },
        });
      });

      it("should be possible to update valid phone without ponctuation of a valid worker", async () => {
        const newPhone = "61999999988";
        await authenticatedManagerexpectations({
          updatePayload: { phone: newPhone },
        });
      });

      it("should not be possible to update phone of a valid worker if invalid phone is provided", async () => {
        const newPhone = "619999999";
        await authenticatedManagerexpectations({
          updatePayload: { phone: newPhone },
          expectedStatusCode: 400,
          expectedResponseData: {
            action:
              "Informe o telefone com a seguinte estrutura (XX)XXXXX-XXXX",
            message: "Número de telefone inválido",
          },
        });
      });
    });

    describe("EMAIL TEST", () => {
      it("should be possible to update valid email of a valid worker", async () => {
        const newEmail = "newEmailValidWorker@email.com";

        await authenticatedManagerexpectations({
          updatePayload: { email: newEmail },
          expectedUpdatedData: { email: emailUtils.normalize(newEmail) },
        });
      });

      it("should not be possible to update valid worker with a invalid email", async () => {
        const newEmail = "newEmailValidWorker";

        await authenticatedManagerexpectations({
          updatePayload: { email: newEmail },
          expectedUpdatedData: { email: emailUtils.normalize(newEmail) },
          expectedStatusCode: 400,
          expectedResponseData: {
            action: "Informe o email com a seguinte estrutura XXXX@XXXX.XXX",
            message: "Email inválido",
          },
        });
      });
    });

    describe("LOGIN TEST", () => {
      it("should be possible to update valid login of a valid worker", async () => {
        const newLogin = "newLoginValidWorker@validEstablishment";

        await authenticatedManagerexpectations({
          updatePayload: { login: newLogin },
          expectedUpdatedData: { login: loginUtils.normalize(newLogin) },
        });
      });

      it("should be possible to update valid login of a valid worker if login is already in use by the same worker", async () => {
        const newLogin = "newLoginValidWorker@validEstablishment";

        await authenticatedManagerexpectations({
          updatePayload: { login: newLogin },
          expectedUpdatedData: { login: loginUtils.normalize(newLogin) },
        });
      });

      it("should not be possible to update valid worker with invalid login", async () => {
        const newLogin = "newLoginValidWorker";

        await authenticatedManagerexpectations({
          updatePayload: { login: newLogin },
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Login inválido",
            action:
              "Informe o login com a seguinte estrutura: NomeDoFuncionário@NomeDaEmpresa",
          },
        });
      });

      it("should not be possible to update valid worker login if the login is already in use by another worker", async () => {
        const worker2Login = (await workerModel.findUniqueBy({ id: worker2Id }))
          ?.login;

        await authenticatedManagerexpectations({
          updatePayload: { login: worker2Login },
          expectedStatusCode: 409,
          expectedResponseData: {
            message: "O Login informado já está em uso por outro funcionário",
            action: "Informe outro login",
          },
        });
      });
    });

    describe("CPF TEST", () => {
      it("should be possible to update valid cpf without ponctuation of a valid worker", async () => {
        const newCpf = "31234360047";

        await authenticatedManagerexpectations({
          updatePayload: { cpf: newCpf },
          expectedUpdatedData: { cpf: cpfUtils.clean(newCpf) },
        });
      });

      it("should be possible to update valid cpf with ponctuation of a valid worker", async () => {
        const newCpf = "312.343.600-47";

        await authenticatedManagerexpectations({
          updatePayload: { cpf: newCpf },
          expectedUpdatedData: { cpf: cpfUtils.clean(newCpf) },
        });
      });

      it("should not be possible to update a valid worker with an invalid cpf", async () => {
        const newCpf = "312.343.600-12";

        await authenticatedManagerexpectations({
          updatePayload: { cpf: newCpf },
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "CPF Inválido",
            action: "O CPF deve seguir a seguinte estrutura XXX.XXX.XXX-XX",
          },
        });
      });
    });

    describe("PASSWORD TEST", () => {
      it("should be possible to update valid password of a valid worker", async () => {
        const newPassword = "newPassword123456789Abc.";
        const { response } = await updateFetch({
          workerId: worker1Id,
          cookie: manager1Cookie,
          password: newPassword,
        });
        expect(response.status).toStrictEqual(200);

        const newWorkerData = await workerModel.findUniqueBy({ id: worker1Id });
        expect(
          passwordUtils.comparePassAndHash(
            newPassword,
            `${newWorkerData?.hash}`,
          ),
        ).toBeTruthy();
      });

      it("should not be possible to update valid worker with a invalid password", async () => {
        const newPassword = "newPassword123456789Abc";
        const { response } = await updateFetch({
          workerId: worker1Id,
          cookie: manager1Cookie,
          password: newPassword,
        });
        expect(response.status).toStrictEqual(400);

        const newWorkerData = await workerModel.findUniqueBy({ id: worker1Id });
        expect(
          passwordUtils.comparePassAndHash(
            newPassword,
            `${newWorkerData?.hash}`,
          ),
        ).toBeFalsy();
      });
    });

    describe("IS MANAGER TEST", () => {
      it("should be possible to update valid worker to be manager", async () => {
        await authenticatedManagerexpectations({
          updatePayload: { is_manager: true },
        });
      });

      it("should be possible to update valid worker to not be manager", async () => {
        await authenticatedManagerexpectations({
          updatePayload: { is_manager: false },
        });
      });
    });
  });

  describe("Authenticated author from establishment", () => {
    it("should be possible to update all fata from a valid worker", async () => {
      const newName = "New Name Valid Worker";
      const newEmail = "NewvalidWorker1Email@email.com";
      const newPhone = "61988888888";
      const newLogin = "newLogin@Establishment1";
      await expectations({
        workerId: worker1Id,
        cookie: author1Cookie,
        expectedStatusCode: 200,
        updatePayload: {
          name: newName,
          email: newEmail,
          cpf: "57837220064",
          phone: newPhone,
          login: newLogin,
        },
        expectedUpdatedData: {
          name: newName,
          email: emailUtils.normalize(newEmail),
          cpf: "57837220064",
          phone: newPhone,
          login: loginUtils.normalize(newLogin),
        },
      });
    });
  });

  describe("Authenticated author not from establishment", () => {
    it("should not be possible to update any data is author is not from establishment", async () => {
      await expectations({
        workerId: worker1Id,
        cookie: author2Cookie,
        expectedStatusCode: 403,
        expectedResponseData: {
          message: "Usuário não tem permissão para fazer essa operação.",
          action: "Contate o suporte.",
        },
      });
    });
  });

  describe("Authenticated worker trying to update yourself", () => {
    it("should not be possible to update any data is author is not from establishment", async () => {
      await expectations({
        workerId: worker1Id,
        cookie: worker1Cookie,
        expectedStatusCode: 403,
        expectedResponseData: {
          message: "Usuário não tem permissão para fazer essa operação.",
          action: "Contate o suporte.",
        },
      });
    });
  });
});
