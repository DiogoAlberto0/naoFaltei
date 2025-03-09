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

let validManager: IValidManager;
let establishment: IEstablishmentFromDB;

let validManager2: IValidManager;
let establishment2: IEstablishmentFromDB;

beforeAll(async () => {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "users", "establishments" RESTART IDENTITY CASCADE'
  );

  validManager = await createValidManager();
  establishment = await createValidEstablishment(validManager.id);

  validManager2 = await createValidManager2();
  establishment2 = await createValidEstablishment2(validManager2.id);

  expect(await userModel.count()).toEqual(2);
  expect(await establishmentModel.count()).toEqual(2);
});

describe("GET on /api/v1/establishment/list", () => {
  describe("Anonymous user", () => {
    it("should return establishment if valid manager id is provided", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/list",
        {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            authorization: validManager.id,
          },
          method: "GET",
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

    it("should return establishment if valid manager id is provided", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/list",
        {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            authorization: validManager2.id,
          },
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

    it("should return error if a invalid manager id is provided", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/list",
        {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            authorization: "123",
          },
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

    it("should return error if  manager id is not provided", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/list",
        {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
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
