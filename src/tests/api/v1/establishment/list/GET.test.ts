import { describe, it, expect, beforeAll } from "vitest";

import { prisma, IEstablishmentFromDB, IUserFromDB } from "@/prisma/prisma";
import { establishmentModel } from "@/src/models/establishment";
import { userModel } from "@/src/models/user";

let user: IUserFromDB;
let establishment: IEstablishmentFromDB;

let user2: IUserFromDB;
let establishment2: IEstablishmentFromDB;

beforeAll(async () => {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "users", "establishments" RESTART IDENTITY CASCADE'
  );
  user = await userModel.createUser({
    email: "user@email.com",
    name: "user",
    password: "123456789Abc.",
  });

  user2 = await userModel.createUser({
    email: "user2@email.com",
    name: "user2",
    password: "123456789Abc.",
  });

  establishment = await establishmentModel.create({
    cep: "01001-000", // CEP válido no formato brasileiro
    email: "establishment@email.com", // E-mail válido
    lat: "-23.55052", // Latitude válida (exemplo: São Paulo)
    lng: "-46.633308", // Longitude válida (exemplo: São Paulo)
    managerId: user.id, // UUID válido
    name: "Establishment", // Nome válido
    phone: "11 98765-4321", // Telefone válido no formato brasileiro
  });

  establishment2 = await establishmentModel.create({
    cep: "01001-000", // CEP válido no formato brasileiro
    email: "establishment2@email.com", // E-mail válido
    lat: "-23.55052", // Latitude válida (exemplo: São Paulo)
    lng: "-46.633308", // Longitude válida (exemplo: São Paulo)
    managerId: user2.id, // UUID válido
    name: "Establishment2", // Nome válido
    phone: "11 98765-4322", // Telefone válido no formato brasileiro
  });

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
            authorization: user.id,
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
            authorization: user2.id,
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
