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
let cookie2: string;

let validUser: IValidManager;
let cookieUser: string;

let validUser2: IValidManager;

beforeAll(async () => {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "establishments", "users" RESTART IDENTITY CASCADE`,
  );

  // valid entitys from establishment 1
  validManager = await createValidManager();
  validEstablishment = await createValidEstablishment(validManager.id);
  cookie = (
    await signinForTest({
      email: validManager.email,
      password: validManager.password,
    })
  ).cookies;
  validUser = await createValidUser();
  cookieUser = (
    await signinForTest({
      email: validUser.email,
      password: validUser.password,
    })
  ).cookies;
  await establishmentModel.addManager({
    establishmentId: validEstablishment.id,
    managerId: validUser.id,
  });

  // valid entitys from establishment 2
  validManager2 = await createValidManager2();
  validEstablishment2 = await createValidEstablishment2(validManager2.id);
  cookie2 = (
    await signinForTest({
      email: validManager2.email,
      password: validManager2.password,
    })
  ).cookies;
  validUser2 = await createValidUser2();
  await establishmentModel.addManager({
    establishmentId: validEstablishment2.id,
    managerId: validUser2.id,
  });
});

describe("DELETE on `/api/v1/establishment/:establishmentId/removeManager", () => {
  describe("Anonymous user", () => {
    it("shoud return error if user is not authenticated", async () => {
      let isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validUser.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();
      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment.id}/removeManager`,
        {
          method: "DELETE",
          body: JSON.stringify({
            managerId: validUser.id,
          }),
        },
      );

      //console.log(response);
      expect(response.status).toEqual(401);

      const data = await response.json();
      expect(data).toEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });

      isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validManager.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();
    });
  });

  describe("Authenticated worker", () => {
    it("should return error if authenticated user is not manager", async () => {
      let isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validUser.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment.id}/removeManager`,
        {
          method: "DELETE",
          headers: { cookie: cookieUser },
          body: JSON.stringify({
            managerId: validUser.id,
          }),
        },
      );

      expect(response.status).toEqual(403);

      const data = await response.json();
      expect(data).toEqual({
        action: "Contate o suporte.",
        message: "Usuário não tem permissão para fazer essa operação.",
      });

      isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validUser.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();
    });
  });
  describe("Authenticade manager from another establishment", () => {
    it("should return error if invalid establishment id is provided", async () => {
      let isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validUser.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment.id}/removeManager`,
        {
          method: "DELETE",
          headers: { cookie: cookie2 },
          body: JSON.stringify({
            managerId: validUser.id,
          }),
        },
      );

      expect(response.status).toEqual(403);

      const data = await response.json();
      expect(data).toEqual({
        action: "Contate o suporte.",
        message: "Usuário não tem permissão para fazer essa operação.",
      });

      isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validUser.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();
    });
  });

  describe("Authenticade user", () => {
    it("should return error if manager is trying to remove yourself", async () => {
      let isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validManager.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment.id}/removeManager`,
        {
          method: "DELETE",
          headers: { cookie },
          body: JSON.stringify({
            managerId: validManager.id,
          }),
        },
      );

      expect(response.status).toEqual(400);

      const data = await response.json();
      expect(data).toEqual({
        action: "Operação inválida",
        message: "Você não pode se desassociar do seu próprio estabelecimento",
      });

      isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validManager.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();
    });
    it("should return error if invalid establishment id is provided", async () => {
      let isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validUser.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${123}/removeManager`,
        {
          method: "DELETE",
          headers: { cookie },
          body: JSON.stringify({
            managerId: validUser.id,
          }),
        },
      );

      expect(response.status).toEqual(404);

      const data = await response.json();
      expect(data).toEqual({
        action:
          "Verifique se os dados informados do estabelecimento estão corretos",
        message: "Estabelecimento não encontrado",
      });

      isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validUser.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();
    });

    it("should return error if invalid manager id is provided", async () => {
      let isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validUser.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment.id}/removeManager`,
        {
          method: "DELETE",
          headers: { cookie },
          body: JSON.stringify({
            managerId: "123ABC",
          }),
        },
      );

      expect(response.status).toEqual(400);

      const data = await response.json();
      expect(data).toEqual({
        action:
          "Verifique se os dados do gerente foram informados corretamente",
        message: "Gerente não encontrado",
      });

      isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validUser.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();
    });

    it("should return error if provided manager is not from establishment", async () => {
      let isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment2.id,
          managerId: validUser2.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment.id}/removeManager`,
        {
          method: "DELETE",
          headers: { cookie },
          body: JSON.stringify({
            managerId: validManager2.id,
          }),
        },
      );

      expect(response.status).toEqual(404);

      const data = await response.json();
      expect(data).toEqual({
        action:
          "Verifique se os dados do gerente foram informados corretamente",
        message: "Gerente não encontrado no estabelecimento",
      });

      isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment2.id,
          managerId: validUser2.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();
    });
    it("should be possible to remove a valid manager from valid establishment", async () => {
      let isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validUser.id,
        });
      expect(isManagerFromEstablishment).toBeTruthy();

      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/${validEstablishment.id}/removeManager`,
        {
          method: "DELETE",
          headers: { cookie },
          body: JSON.stringify({
            managerId: validUser.id,
          }),
        },
      );

      expect(response.status).toEqual(200);

      const data = await response.json();
      expect(data).toEqual({
        message: "Gerênte removido com sucesso",
      });

      isManagerFromEstablishment =
        await establishmentModel.verifyIfManagerIsFromEstablishment({
          establishmentId: validEstablishment.id,
          managerId: validUser.id,
        });
      expect(isManagerFromEstablishment).toBeFalsy();
    });
  });
});
