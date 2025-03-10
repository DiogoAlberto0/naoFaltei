import { describe, it, expect, beforeEach } from "vitest";

// client
import { prisma, type IEstablishmentFromDB } from "@/prisma/prisma";

// models
import { establishmentModel } from "@/src/models/establishment";
import { userModel } from "@/src/models/user";

//utils
import { emailUtils } from "@/src/utils/email";
import { phoneUtils } from "@/src/utils/phone";
import { cepUtils } from "@/src/utils/cep";

//valid entitys for tests
import {
  type IValidManager,
  createValidEstablishment,
  createValidEstablishment2,
  createValidManager,
  createValidManager2,
} from "@/src/tests/entitysForTest";
import { signinForTest } from "@/src/tests/signinForTest";

let validEstablishment: IEstablishmentFromDB;
let validManager: IValidManager;
let cookieManager: string;

let validEstablishment2: IEstablishmentFromDB;
let validManager2: IValidManager;
let cookieManager2: string;

const validateTimestamps = (data: {
  created_at: string;
  updated_at: string;
}) => {
  expect(Date.parse(data.created_at)).not.toBeNaN();
  expect(Date.parse(data.updated_at)).not.toBeNaN();
  expect(Date.parse(data.created_at)).not.toEqual(Date.parse(data.updated_at));
  expect(Date.parse(data.updated_at)).toBeGreaterThan(
    Date.parse(data.created_at)
  );
};
beforeEach(async () => {
  await prisma.$queryRawUnsafe(
    `TRUNCATE TABLE "users", "establishments" RESTART IDENTITY CASCADE`
  );
  expect(await userModel.count()).toEqual(0);
  expect(await establishmentModel.count()).toEqual(0);

  validManager = await createValidManager();
  validEstablishment = await createValidEstablishment(validManager.id);
  const { cookies } = await signinForTest({
    email: validManager.email,
    password: validManager.password,
  });
  cookieManager = cookies;

  validManager2 = await createValidManager2();
  validEstablishment2 = await createValidEstablishment2(validManager2.id);
  const { cookies: cookies2 } = await signinForTest({
    email: validManager2.email,
    password: validManager2.password,
  });
  cookieManager2 = cookies2;

  expect(await userModel.count()).toEqual(2);
  expect(await establishmentModel.count()).toEqual(2);
});

describe("PUT on /api/v1/establishment/update/:ID", () => {
  describe("Authenticated manager from anohter establishment", () => {
    it("should be return error if user is not authenticated", async () => {
      const newName = "Novo nome";
      const body = {
        name: newName,
      };
      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: { cookie: cookieManager2 },
        }
      );

      expect(response.status).toEqual(403);

      const data = await response.json();

      expect(data).toEqual({
        message: "Usuário não tem permissão.",
        action: "Contate o suporte.",
      });
    });
  });
  describe("Anonymous user", () => {
    it("should be return error if user is not authenticated", async () => {
      const newName = "Novo nome";
      const body = {
        name: newName,
      };
      const response = await fetch(
        `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
        }
      );

      expect(response.status).toEqual(401);

      const data = await response.json();

      expect(data).toEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });
    });
  });
  describe("Authenticated manager from establishment", () => {
    describe("UPDATE NAME TESTS", () => {
      it("should be possible to update name of an valid establishment", async () => {
        const newName = "Novo nome";
        const body = {
          name: newName,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(200);

        const data = await response.json();

        expect(data).toEqual({
          name: newName,
          id: validEstablishment.id,
          email: validEstablishment.email,
          phone: validEstablishment.phone,
          cep: validEstablishment.cep,
          lat: validEstablishment.lat,
          lng: validEstablishment.lng,
          active: validEstablishment.active,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          author_id: validManager.id,
        });

        validateTimestamps(data);
      });
    });

    describe("UPDATE EMAIL TESTS", () => {
      it("should be possible to update email of an valid establishment", async () => {
        const newEmail = "Novo@email.com";
        const body = {
          email: newEmail,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(200);

        const data = await response.json();

        expect(data).toEqual({
          name: validEstablishment.name,
          id: validEstablishment.id,
          email: emailUtils.normalize(newEmail),
          phone: validEstablishment.phone,
          cep: validEstablishment.cep,
          lat: validEstablishment.lat,
          lng: validEstablishment.lng,
          active: validEstablishment.active,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          author_id: validManager.id,
        });

        validateTimestamps(data);
      });

      it("should not be possible to update if invalid email is provided", async () => {
        const newEmail = "asdasd";
        const body = {
          email: newEmail,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(400);

        const data = await response.json();

        expect(data).toEqual({
          message: "Email inválido",
          action:
            "Informe um email válido seguindo a seguinte estrutura: XXXX@XXXX.XXX",
        });

        const establishmentFromDB = await prisma.establishment.findUnique({
          where: { id: validEstablishment.id },
        });

        expect(establishmentFromDB).toEqual(validEstablishment);
      });

      it("should not be possible to update if provided email is already in use by another establishment", async () => {
        const newEmail = validEstablishment2.email;
        const body = {
          email: newEmail,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(409);

        const data = await response.json();

        expect(data).toEqual({
          message:
            "O email fornecido ja está em uso por outro estabelecimento.",
          action: "Informe outro email.",
        });

        const establishmentFromDB = await prisma.establishment.findUnique({
          where: { id: validEstablishment.id },
        });

        expect(establishmentFromDB).toEqual(validEstablishment);
      });
    });

    describe("UPDATE PHONE TESTS", () => {
      it("should be possible to update phone of an valid establishment", async () => {
        const newPhone = "61900000000";
        const body = {
          phone: newPhone,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(200);

        const data = await response.json();

        expect(data).toEqual({
          name: validEstablishment.name,
          id: validEstablishment.id,
          email: validEstablishment.email,
          phone: phoneUtils.clean(newPhone),
          cep: validEstablishment.cep,
          lat: validEstablishment.lat,
          lng: validEstablishment.lng,
          active: validEstablishment.active,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          author_id: validManager.id,
        });

        validateTimestamps(data);
      });

      it("should be possible to update phone with ponctuation of an valid establishment", async () => {
        const newPhone = "(61)90000-0000";
        const body = {
          phone: newPhone,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(200);

        const data = await response.json();

        expect(data).toEqual({
          name: validEstablishment.name,
          id: validEstablishment.id,
          email: validEstablishment.email,
          phone: phoneUtils.clean(newPhone),
          cep: validEstablishment.cep,
          lat: validEstablishment.lat,
          lng: validEstablishment.lng,
          active: validEstablishment.active,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          author_id: validManager.id,
        });

        validateTimestamps(data);
      });

      it("should not be possible to update if invalid phone is provided", async () => {
        const newPhone = "12345";
        const body = {
          phone: newPhone,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(400);

        const data = await response.json();

        expect(data).toEqual({
          message: "Telefone inválido",
          action:
            "Informe um telefone válido seguindo a seguinte estrutura: (XX)XXXXX-XXXX",
        });

        const establishmentFromDB = await prisma.establishment.findUnique({
          where: { id: validEstablishment.id },
        });

        expect(establishmentFromDB).toEqual(validEstablishment);
      });

      it("should not be possible to update if provided phone is already in use by another establishment", async () => {
        const newPhone = validEstablishment2.phone;
        const body = {
          phone: newPhone,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(409);

        const data = await response.json();

        expect(data).toEqual({
          message:
            "O telefone fornecido já está em uso por outro estabelecimento.",
          action: "Informe outro telefone.",
        });

        const establishmentFromDB = await prisma.establishment.findUnique({
          where: { id: validEstablishment.id },
        });

        expect(establishmentFromDB).toEqual(validEstablishment);
      });
    });

    describe("UPDATE CEP TESTS", () => {
      it("should be possible to update cep, if valid cep is provided", async () => {
        const newCep = "71805709";
        const body = {
          cep: newCep,
        };

        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(200);

        const data = await response.json();

        expect(data).toEqual({
          id: validEstablishment.id,
          name: validEstablishment.name,
          email: validEstablishment.email,
          phone: validEstablishment.phone,
          cep: cepUtils.clean(newCep),
          lat: validEstablishment.lat,
          lng: validEstablishment.lng,
          active: validEstablishment.active,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          author_id: validManager.id,
        });

        validateTimestamps(data);

        const updatedCEP = await prisma.establishment.findUnique({
          where: {
            id: validEstablishment.id,
          },
          select: { cep: true },
        });

        expect(updatedCEP).toEqual({
          cep: cepUtils.clean(newCep),
        });
      });

      it("should be possible to update cep, if valid cep with ponctuation is provided", async () => {
        const newCep = "71805-709";
        const body = {
          cep: newCep,
        };

        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(200);

        const data = await response.json();

        expect(data).toEqual({
          id: validEstablishment.id,
          name: validEstablishment.name,
          email: validEstablishment.email,
          phone: validEstablishment.phone,
          cep: cepUtils.clean(newCep),
          lat: validEstablishment.lat,
          lng: validEstablishment.lng,
          active: validEstablishment.active,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          author_id: validManager.id,
        });

        validateTimestamps(data);

        const updatedCEP = await prisma.establishment.findUnique({
          where: {
            id: validEstablishment.id,
          },
          select: { cep: true },
        });

        expect(updatedCEP).toEqual({
          cep: cepUtils.clean(newCep),
        });
      });

      it("should not be possible to update cep, if invalid cep is provided", async () => {
        const newCep = "7180570";
        const body = {
          cep: newCep,
        };

        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(400);

        const data = await response.json();

        expect(data).toEqual({
          message: "CEP inválido",
          action:
            "Informe um CEP válido seguindo a seguinte estrutura: XXXXX-XXX",
        });

        const updatedCEP = await prisma.establishment.findUnique({
          where: {
            id: validEstablishment.id,
          },
        });

        expect(updatedCEP).toEqual(validEstablishment);
      });
    });

    describe("UPDATE COORDS TESTS", () => {
      it("should be possible to update coordinates if valid latitude an longitude is provided", async () => {
        const newLatitude = "-23.550520";
        const newLongitude = "-46.633308";
        const body = {
          coords: {
            lat: newLatitude,
            lng: newLongitude,
          },
        };

        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(200);

        const data = await response.json();

        expect(data).toEqual({
          id: validEstablishment.id,
          name: validEstablishment.name,
          email: validEstablishment.email,
          phone: validEstablishment.phone,
          cep: validEstablishment.cep,
          lat: newLatitude,
          lng: newLongitude,
          active: validEstablishment.active,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          author_id: validManager.id,
        });

        validateTimestamps(data);

        const updatedEstablishment = await prisma.establishment.findUnique({
          where: {
            id: validEstablishment.id,
          },
          select: { lat: true, lng: true },
        });

        expect(updatedEstablishment).toEqual({
          lat: newLatitude,
          lng: newLongitude,
        });
      });

      it("should not be possible to update coordinates if invalid latitude is provided", async () => {
        const newLatitude = "100.123456";
        const newLongitude = "-46.633308";
        const body = {
          coords: {
            lat: newLatitude,
            lng: newLongitude,
          },
        };

        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(400);

        const data = await response.json();

        expect(data).toEqual({
          message: "Latitude inválida",
          action: "Informe uma coordenada válida",
        });

        const updatedEstablishment = await prisma.establishment.findUnique({
          where: {
            id: validEstablishment.id,
          },
        });

        expect(updatedEstablishment).toEqual(validEstablishment);
      });

      it("should not be possible to update coordinates if invalid longitude is provided", async () => {
        const newLatitude = "-23.550520";
        const newLongitude = "200.123456";
        const body = {
          coords: {
            lat: newLatitude,
            lng: newLongitude,
          },
        };

        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(400);

        const data = await response.json();

        expect(data).toEqual({
          message: "Longitude inválida",
          action: "Informe uma coordenada válida",
        });

        const updatedEstablishment = await prisma.establishment.findUnique({
          where: {
            id: validEstablishment.id,
          },
        });

        expect(updatedEstablishment).toEqual(validEstablishment);
      });

      it("should not be possible to update coordinates if only latitude is provided", async () => {
        const newLatitude = "-23.550520";
        const body = {
          coords: {
            lat: newLatitude,
          },
        };

        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(400);

        const data = await response.json();

        expect(data).toEqual({
          message: "Coordenadas inválidas",
          action:
            "Informe as coordenadas com os parametros 'lat' para latitude e 'lng' para longitude",
        });

        const updatedEstablishment = await prisma.establishment.findUnique({
          where: {
            id: validEstablishment.id,
          },
        });

        expect(updatedEstablishment).toEqual(validEstablishment);
      });

      it("should not be possible to update coordinates if only longitude is provided", async () => {
        const newLongitude = "-46.633308";
        const body = {
          coords: {
            lng: newLongitude,
          },
        };

        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { cookie: cookieManager },
          }
        );

        expect(response.status).toEqual(400);

        const data = await response.json();

        expect(data).toEqual({
          message: "Coordenadas inválidas",
          action:
            "Informe as coordenadas com os parametros 'lat' para latitude e 'lng' para longitude",
        });

        const updatedEstablishment = await prisma.establishment.findUnique({
          where: {
            id: validEstablishment.id,
          },
        });

        expect(updatedEstablishment).toEqual(validEstablishment);
      });
    });
  });
});
