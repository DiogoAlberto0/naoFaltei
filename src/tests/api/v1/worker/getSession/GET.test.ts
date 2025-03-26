import { prisma } from "@/prisma/prisma";
import {
  createValidEstablishment,
  createValidEstablishmentCreator,
  createValidManager,
  IValidManager,
} from "@/src/tests/entitysForTest";
import { signinForTest } from "@/src/tests/signinForTest";
import { beforeAll, describe, it, expect } from "vitest";

let validManager: IValidManager;
let managerCookie: string;
beforeAll(async () => {
  await prisma.$queryRawUnsafe(
    `TRUNCATE TABLE "users", "establishments", "workers" RESTART IDENTITY CASCADE;`,
  );
  const admin = await createValidEstablishmentCreator();

  const validEstablishment = await createValidEstablishment(admin.id);

  validManager = await createValidManager(validEstablishment.id);

  const { cookies } = await signinForTest({
    login: validManager.login,
    password: validManager.password,
  });

  expect(cookies).toBeTypeOf("string");

  managerCookie = cookies;
});
describe("GET on `/api/v1/worker/getSession`", () => {
  describe("Valid manager", () => {
    it("should be return worker session if a valid manager cookie is provided", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/worker/getSession",
        {
          method: "GET",
          headers: {
            cookie: managerCookie,
          },
        },
      );

      expect(response.status).toEqual(200);

      const data = await response.json();

      expect(data).toStrictEqual({
        session: {
          user: {
            name: expect.any(String),
            id: validManager.id,
          },
          expires: expect.any(String),
        },
      });

      expect(new Date(data.session.expires).getTime()).not.toBeNaN();
    });
  });

  describe("Valid manager", () => {
    it("should be return unauthorized error if cookie is not provided", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/worker/getSession",
        {
          method: "GET",
        },
      );

      expect(response.status).toEqual(401);

      const data = await response.json();

      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Contate o suporte",
      });
    });
  });

  describe("Valid manager", () => {
    it("should be return unauthorized error if invalid cookie is provided", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/worker/getSession",
        {
          method: "GET",
          headers: {
            cookie:
              "session=eyJ1c2VySWQiOiIxMjM0NTYifQ==; Path=/; HttpOnly; Secure",
          },
        },
      );

      expect(response.status).toEqual(401);

      const data = await response.json();

      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Contate o suporte",
      });
    });
  });
});
