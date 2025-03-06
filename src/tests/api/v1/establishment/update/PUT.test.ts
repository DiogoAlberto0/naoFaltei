import { describe, it, expect, beforeEach } from "vitest";

// client
import { prisma } from "@/prisma/prisma";

// models
import {
  establishmentModel,
  type IEstablishmentFromDB,
} from "@/src/models/establishment";
import { userModel, type IUserFromDB } from "@/src/models/user";

//utils
import { emailUtils } from "@/src/utils/email";
import { phoneUtils } from "@/src/utils/phone";
import { cepUtils } from "@/src/utils/cep";

let validEstablishment: IEstablishmentFromDB;
let validUser: IUserFromDB;

let validEstablishment2: IEstablishmentFromDB;
let validUser2: IUserFromDB;

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

  validUser = await userModel.createUser({
    name: "user",
    email: "user@teste.com",
    password: "123456789Abc.",
  });

  validEstablishment = await establishmentModel.create({
    name: "Estabelecimento",
    cep: "71800800",
    email: "estabelecimento@teste.com",
    lat: "-23.550520",
    lng: "-46.633308",
    managerId: validUser.id,
    phone: "61999999999",
  });

  validUser2 = await userModel.createUser({
    name: "user2",
    email: "user2@teste.com",
    password: "123456789Abc.",
  });

  validEstablishment2 = await establishmentModel.create({
    name: "Estabelecimento2",
    cep: "71800800",
    email: "estabelecimento2@teste.com",
    lat: "-23.550520",
    lng: "-46.633308",
    managerId: validUser2.id,
    phone: "61999999998",
  });

  expect(await userModel.count()).toEqual(2);
  expect(await establishmentModel.count()).toEqual(2);
});

describe("PUT on /api/v1/establishment/update/:ID", () => {
  describe("Anonymous user", () => {
    describe("UPDATE NAME TESTS", () => {
      it("should be possible to update name of an valid establishment", async () => {
        const newName = "Novo nome";
        const body = {
          managerId: validUser.id,
          name: newName,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
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
        });

        validateTimestamps(data);
      });
    });

    describe("UPDATE EMAIL TESTS", () => {
      it("should be possible to update email of an valid establishment", async () => {
        const newEmail = "Novo@email.com";
        const body = {
          managerId: validUser.id,
          email: newEmail,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
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
        });

        validateTimestamps(data);
      });

      it("should be not possible to update if invalid email is provided", async () => {
        const newEmail = "asdasd";
        const body = {
          managerId: validUser.id,
          email: newEmail,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
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
          managerId: validUser.id,
          email: newEmail,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
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
          managerId: validUser.id,
          phone: newPhone,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
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
        });

        validateTimestamps(data);
      });

      it("should be possible to update phone with ponctuation of an valid establishment", async () => {
        const newPhone = "(61)90000-0000";
        const body = {
          managerId: validUser.id,
          phone: newPhone,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
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
        });

        validateTimestamps(data);
      });

      it("should be not possible to update if invalid phone is provided", async () => {
        const newPhone = "12345";
        const body = {
          managerId: validUser.id,
          phone: newPhone,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
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

      it("should not be possible to update if provided email is already in use by another establishment", async () => {
        const newPhone = validEstablishment2.phone;
        const body = {
          managerId: validUser.id,
          phone: newPhone,
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/establishment/update/${validEstablishment.id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
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
      it("should be possible to coordinates if valid latitude an longitude is provided", async () => {
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

      it("should be possible to coordinates if invalid latitude is provided", async () => {
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

      it("should be possible to coordinates if invalid longitude is provided", async () => {
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

      it("should be possible to coordinates if only latitude is provided", async () => {
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

      it("should be possible to coordinates if only longitude is provided", async () => {
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
