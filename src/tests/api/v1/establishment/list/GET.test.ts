import { describe, it, expect, beforeAll } from "vitest";

import { prisma, type IEstablishmentFromDB } from "@/prisma/prisma";
import { establishmentModel } from "@/src/models/establishment";
import { userModel } from "@/src/models/user";

// valid entitys for test
import {
  type IValidManager,
  createValidEstablishment,
  createValidEstablishment2,
  createValidManager,
  createValidManager2,
} from "@/src/tests/entitysForTest";
import { signinForTest } from "@/src/tests/signinForTest";

let validManager: IValidManager;
let establishment: IEstablishmentFromDB;
let cookieManager: string;

let validManager2: IValidManager;
let establishment2: IEstablishmentFromDB;
let cookieManager2: string;

beforeAll(async () => {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "users", "establishments" RESTART IDENTITY CASCADE'
  );

  validManager = await createValidManager();
  establishment = await createValidEstablishment(validManager.id);
  const { cookies } = await signinForTest({
    email: validManager.email,
    password: validManager.password,
  });
  cookieManager = cookies;
  console.log(cookieManager);

  validManager2 = await createValidManager2();
  establishment2 = await createValidEstablishment2(validManager2.id);
  const { cookies: cookies2 } = await signinForTest({
    email: validManager2.email,
    password: validManager2.password,
  });
  cookieManager2 = cookies2;

  expect(await userModel.count()).toEqual(2);
  expect(await establishmentModel.count()).toEqual(2);
});

describe("GET on /api/v1/establishment/list", () => {
  describe("Valid Manager Authenticated", () => {
    it("should return establishment", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/list",
        {
          method: "GET",
          headers: { cookie: cookieManager },
        }
      );

      expect(response.status).toEqual(200);

      const data = await response.json();

      expect(data.establishments).toBeInstanceOf(Array);
      expect(data.establishments).toHaveLength(1);

      expect(data.establishments[0]).toStrictEqual({
        ...establishment,
        created_at: new Date(establishment.created_at).toISOString(),
        updated_at: new Date(establishment.updated_at).toISOString(),
      });
    });
  });
  describe("Valid Manager 2 Authenticated", () => {
    it("should return establishment if valid manager id is provided", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/list",
        {
          headers: { cookie: cookieManager2 },
          method: "GET",
        }
      );

      expect(response.status).toEqual(200);

      const data = await response.json();

      expect(data.establishments).toBeInstanceOf(Array);
      expect(data.establishments).toHaveLength(1);

      expect(data.establishments[0]).toStrictEqual({
        ...establishment2,
        created_at: new Date(establishment2.created_at).toISOString(),
        updated_at: new Date(establishment2.updated_at).toISOString(),
      });
    });
  });
  describe("Anonymous user", () => {
    it("should return error", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/list",
        {
          method: "GET",
        }
      );

      expect(response.status).toEqual(401);

      const data = await response.json();

      expect(data).toStrictEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });
  });
});
