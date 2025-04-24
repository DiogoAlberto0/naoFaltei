import { beforeAll, describe, expect, it } from "vitest";

import { resetAllDatabase } from "@/prisma/prisma";

//models
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "@/src/app/(back)/models/worker";

//valid entitys
import {
  createValidAuthor,
  createValidEstablishment,
  createValidManager,
  IValidAuthor,
} from "@/src/app/(back)/tests/entitysForTest";

let establishmentCreator: IValidAuthor;
let validManager: {
  id: string;
  login: string;
  password: string;
};
beforeAll(async () => {
  await resetAllDatabase();

  establishmentCreator = await createValidAuthor();

  const validEstablishment = await createValidEstablishment(
    establishmentCreator.id,
  );

  validManager = await createValidManager(validEstablishment.id);

  expect(await workerModel.count()).toEqual(1);
  expect(await establishmentModel.count()).toEqual(1);
});

describe("POST on /api/v1/signin", () => {
  const signinExpectations = async ({
    login,
    password,
    isSuccefulCase = true,
  }: {
    login: string;
    password: string;
    isSuccefulCase?: boolean;
  }) => {
    const response = await fetch("http://localhost:3000/api/v1/signin", {
      body: JSON.stringify({
        login,
        password,
      }),
      method: "POST",
      credentials: "include",
    });

    console.log(response);
    if (isSuccefulCase) {
      expect(response.headers.get("set-cookie")).not.toBeUndefined();
      expect(response.headers.get("set-cookie")).not.toBeNull();
      expect(response.headers.get("set-cookie")).toBeTypeOf("string");
    } else {
      const data = await response.json();
      expect(data).toEqual({
        message:
          "Credenciais inválidas. Verifique seu e-mail e senha e tente novamente.",
        action: "Se o erro persistir contate o suporte.",
      });
    }
  };
  it("should be possible to signin with an valid author", async () => {
    await signinExpectations({
      login: establishmentCreator.email,
      password: establishmentCreator.password,
    });
  });

  it("should be possible to signin with an valid author with captalize email", async () => {
    await signinExpectations({
      login: establishmentCreator.email.toLocaleUpperCase(),
      password: establishmentCreator.password,
    });
  });
  it("should be possible to signin with an valid manager data", async () => {
    await signinExpectations({
      login: validManager.login.toLocaleUpperCase(),
      password: validManager.password,
    });
  });

  it("should not be possible to signin with a invalid manager login", async () => {
    await signinExpectations({
      login: "invalidLogin",
      password: validManager.password,
      isSuccefulCase: false,
    });
  });
  it("should not be possible to signin with a invalid manager password", async () => {
    await signinExpectations({
      login: validManager.login,
      password: "invalidPassword",
      isSuccefulCase: false,
    });
  });
});
