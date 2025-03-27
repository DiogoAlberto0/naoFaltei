import { beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/prisma/prisma";

//models
import { establishmentModel } from "@/src/models/establishment";
import { workerModel } from "@/src/models/worker";

//valid entitys
import {
  createValidAutho,
  createValidEstablishment,
  createValidManager,
  IValidAuthor,
} from "@/src/tests/entitysForTest";

let establishmentCreator: IValidAuthor;
let validManager: {
  id: string;
  login: string;
  password: string;
};
beforeAll(async () => {
  await prisma.$queryRawUnsafe(
    `TRUNCATE TABLE "users", "establishments", "workers" RESTART IDENTITY CASCADE;`,
  );

  establishmentCreator = await createValidAutho();

  const validEstablishment = await createValidEstablishment(
    establishmentCreator.id,
  );

  validManager = await createValidManager(validEstablishment.id);

  expect(await workerModel.count()).toEqual(1);
  expect(await establishmentModel.count()).toEqual(1);
});

describe("POST on /api/v1/signin", () => {
  it("should be possible to signin with an valid author", async () => {
    const response = await fetch("http://localhost:3000/api/v1/signin", {
      body: JSON.stringify({
        login: establishmentCreator.email,
        password: establishmentCreator.password,
      }),
      method: "POST",
      credentials: "include",
    });

    expect(response.headers.get("set-cookie")).not.toBeUndefined();
    expect(response.headers.get("set-cookie")).not.toBeNull();
    expect(response.headers.get("set-cookie")).toBeTypeOf("string");
  });
  it("should be possible to signin with an valid manager data", async () => {
    const response = await fetch("http://localhost:3000/api/v1/signin", {
      body: JSON.stringify({
        login: validManager.login,
        password: validManager.password,
      }),
      method: "POST",
      credentials: "include",
    });

    expect(response.headers.get("set-cookie")).not.toBeUndefined();
    expect(response.headers.get("set-cookie")).not.toBeNull();
    expect(response.headers.get("set-cookie")).toBeTypeOf("string");
  });

  it("should not be possible to signin with a invalid manager login", async () => {
    const response = await fetch("http://localhost:3000/api/v1/signin", {
      body: JSON.stringify({
        login: "invalidLogin",
        password: validManager.password,
      }),
      method: "POST",
      credentials: "include",
    });
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.status).toEqual(400);

    const data = await response.json();
    expect(data).toEqual({
      message: "Usuário ou senha incorretos",
      action: "Verifique os campos informados.",
    });
  });
  it("should not be possible to signin with a invalid manager password", async () => {
    const response = await fetch("http://localhost:3000/api/v1/signin", {
      body: JSON.stringify({
        login: validManager.login,
        password: "invalid password",
      }),
      method: "POST",
      credentials: "include",
    });
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.status).toEqual(400);

    const data = await response.json();
    expect(data).toEqual({
      message: "Usuário ou senha incorretos",
      action: "Verifique os campos informados.",
    });
  });
});
