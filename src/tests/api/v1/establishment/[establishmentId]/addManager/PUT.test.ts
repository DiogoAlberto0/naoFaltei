import { IEstablishmentFromDB, prisma } from "@/prisma/prisma";
import { establishmentModel } from "@/src/models/establishment";
import {
  createValidEstablishment,
  createValidEstablishment2,
  createValidManager,
  createValidManager2,
  createValidUser,
  createValidUser2,
  IValidManager,
} from "@/src/tests/entitysForTest";
import { signinForTest } from "@/src/tests/signinForTest";
import { describe, it, expect, beforeAll } from "vitest";

let validManager: IValidManager;
let validEstablishment: IEstablishmentFromDB;
let cookie: string;

let validManager2: IValidManager;
let validEstablishment2: IEstablishmentFromDB;

let newManager: IValidManager;
let newManager2: IValidManager;

beforeAll(async () => {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "establishments", "users" RESTART IDENTITY CASCADE`,
  );

  validManager = await createValidManager();
  validEstablishment = await createValidEstablishment(validManager.id);
  const { cookies } = await signinForTest({
    email: validManager.email,
    password: validManager.password,
  });
  cookie = cookies;

  validManager2 = await createValidManager2();
  validEstablishment2 = await createValidEstablishment2(validManager2.id);

  newManager = await createValidUser();
  newManager2 = await createValidUser2();
});

describe("PUT on `/api/v1/establishment/:id/addManager`", () => {
  describe("Anonymous user", () => {
    it("should not be possible to add valid manager to a invalid establishment", async () => {
      let managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });
      expect(managers.length).toEqual(0);

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment2.id}/addManager`,
        {
          body: JSON.stringify({
            newManagerEmail: newManager.email,
          }),
          method: "PUT",
        },
      );

      expect(response.status).toEqual(401);

      const data = await response.json();

      expect(data).toEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });

      managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });

      expect(managers.length).toEqual(0);
    });
  });
  describe("Authenticated user from another establishment", () => {
    it("should not be possible to add valid manager to a invalid establishment", async () => {
      let managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });
      expect(managers.length).toEqual(0);

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment2.id}/addManager`,
        {
          body: JSON.stringify({
            newManagerEmail: newManager.email,
          }),
          method: "PUT",
          headers: { cookie },
        },
      );

      expect(response.status).toEqual(403);

      const data = await response.json();

      expect(data).toEqual({
        message: "Usuário não tem permissão para fazer essa operação.",
        action: "Contate o suporte.",
      });

      managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });

      expect(managers.length).toEqual(0);
    });
  });
  describe("Authenticated user", () => {
    it("should not be possible to add valid manager to a invalid establishment", async () => {
      let managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });
      expect(managers.length).toEqual(0);

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${12345}/addManager`,
        {
          body: JSON.stringify({
            newManagerEmail: newManager.email,
          }),
          method: "PUT",
          headers: { cookie },
        },
      );

      expect(response.status).toEqual(404);

      const data = await response.json();

      expect(data).toEqual({
        message: "Estabelecimento não encontrado",
        action:
          "Verifique se os dados informados do estabelecimento estão corretos",
      });

      managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });

      expect(managers.length).toEqual(0);
    });

    it("should not be possible to add valid manager to a invalid establishment", async () => {
      let managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });
      expect(managers.length).toEqual(0);

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment.id}/addManager`,
        {
          body: JSON.stringify({
            newManagerEmail: "notExistent@email.com",
          }),
          method: "PUT",
          headers: { cookie },
        },
      );

      expect(response.status).toEqual(404);

      const data = await response.json();

      expect(data).toEqual({
        message: "Novo gerênte não encontrado",
        action: "Verifique se o email do novo gerênte está correto",
      });

      managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });

      expect(managers.length).toEqual(0);
    });

    it("should be possible to add valid manager to an valid establishment", async () => {
      let managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });
      expect(managers.length).toEqual(0);

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment.id}/addManager`,
        {
          body: JSON.stringify({
            newManagerEmail: newManager.email,
          }),
          method: "PUT",
          headers: { cookie },
        },
      );

      expect(response.status).toEqual(200);

      const data = await response.json();

      expect(data).toEqual({
        message: "Novo gerênte adicionado com sucesso",
      });

      managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });

      expect(managers.length).toEqual(1);
    });

    it("should return error if user is already manager from establishment", async () => {
      let managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });
      expect(managers.length).toEqual(1);

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment.id}/addManager`,
        {
          body: JSON.stringify({
            newManagerEmail: newManager.email.toUpperCase(),
          }),
          method: "PUT",
          headers: { cookie },
        },
      );

      expect(response.status).toEqual(409);

      const data = await response.json();

      expect(data).toEqual({
        message: "O usuário já é gerênte do estabelecimento.",
        action: "Verifique o email do usuário",
      });

      managers = await establishmentModel.listByManager({
        managerId: newManager.id,
      });

      expect(managers.length).toEqual(1);
    });

    it("should be possible to add valid manager with UpperCase email to an valid establishment", async () => {
      let managers = await establishmentModel.listByManager({
        managerId: newManager2.id,
      });
      expect(managers.length).toEqual(0);

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment.id}/addManager`,
        {
          body: JSON.stringify({
            newManagerEmail: newManager2.email.toUpperCase(),
          }),
          method: "PUT",
          headers: { cookie },
        },
      );

      expect(response.status).toEqual(200);

      const data = await response.json();

      expect(data).toEqual({
        message: "Novo gerênte adicionado com sucesso",
      });

      managers = await establishmentModel.listByManager({
        managerId: newManager2.id,
      });

      expect(managers.length).toEqual(1);
    });
  });
});
