import { describe, it, expect, beforeAll } from "vitest";

import {
  prisma,
  resetAllDatabase,
  type IEstablishmentFromDB,
} from "@/prisma/prisma";

// models
import { establishmentModel } from "@/src/app/(back)/models/establishment";
import { workerModel } from "@/src/app/(back)/models/worker";

// valid entitys for test
import {
  type IValidManager,
  createValidEstablishment,
  createValidEstablishment2,
  createValidAutho,
  createValidManager,
  createValidManager2,
} from "@/src/app/(back)/tests/entitysForTest";
import { signinForTest } from "@/src/app/(back)/tests/signinForTest";

let authorCookie: string;

let validManager: IValidManager;
let establishment: IEstablishmentFromDB;
let cookieManager: string;

let validManager2: IValidManager;
let establishment2: IEstablishmentFromDB;
let cookieManager2: string;

beforeAll(async () => {
  await resetAllDatabase();

  const author = await createValidAutho();
  const { cookies: cookies3 } = await signinForTest({
    login: author.email,
    password: author.password,
  });
  authorCookie = cookies3;

  establishment = await createValidEstablishment(author.id);
  validManager = await createValidManager(establishment.id);
  const { cookies } = await signinForTest({
    login: validManager.login,
    password: validManager.password,
  });
  cookieManager = cookies;
  console.log(cookieManager);

  establishment2 = await createValidEstablishment2(author.id);
  validManager2 = await createValidManager2(establishment2.id);
  const { cookies: cookies2 } = await signinForTest({
    login: validManager2.login,
    password: validManager2.password,
  });
  cookieManager2 = cookies2;
  console.log(cookieManager2);

  expect(await workerModel.count()).toEqual(2);
  expect(await establishmentModel.count()).toEqual(2);
});

describe("GET on /api/v1/establishment/list", () => {
  describe("Valid author Authenticated", () => {
    it("should return establishment", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/list",
        {
          method: "GET",
          headers: { cookie: authorCookie },
        },
      );

      expect(response.status).toEqual(200);

      const data = await response.json();

      expect(data.establishments).toBeInstanceOf(Array);
      expect(data.establishments).toHaveLength(2);

      expect(data.establishments[0]).toStrictEqual({
        id: establishment.id,
        name: establishment.name,
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
        },
      );

      expect(response.status).toEqual(200);

      const data = await response.json();

      expect(data.establishments).toBeInstanceOf(Array);
      expect(data.establishments).toHaveLength(0);
    });
  });
  describe("Anonymous user", () => {
    it("should return error", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/list",
        {
          method: "GET",
        },
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
