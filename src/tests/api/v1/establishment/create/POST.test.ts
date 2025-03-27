import { describe, it, expect, beforeAll } from "vitest";

import { prisma } from "@/prisma/prisma";

import { establishmentModel } from "@/src/models/establishment";

// valid entity for tests
import { createValidAutho, IValidAuthor } from "@/src/tests/entitysForTest";
import { signinForTest } from "@/src/tests/signinForTest";

const validEstablishment = {
  name: "Empresa teste",
  email: "teste@empresa.com",
  phone: "61986548270",
  cep: "71800-000",
  lat: "-23.550520",
  lng: "-46.633308",
};

const validEstablishment2 = {
  name: "Empresa teste 2",
  email: "teste2@empresa.com",
  phone: "61986548271",
  cep: "71800000",
  lat: "-23.550520",
  lng: "-46.633308",
};

let cookie: string;
let author: IValidAuthor;

beforeAll(async () => {
  await prisma.$queryRawUnsafe(
    `TRUNCATE TABLE "establishments", "users" RESTART IDENTITY CASCADE`,
  );
  expect(await establishmentModel.count()).toEqual(0);

  author = await createValidAutho();

  const { cookies } = await signinForTest({
    login: author.email,
    password: author.password,
  });

  cookie = cookies;
});

describe("POST on `/api/v1/establishment/create`", () => {
  describe("Anonymous user", () => {
    it("should not be possible to register a new establishment if cookie is not provider", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/create",
        {
          method: "POST",
          body: JSON.stringify({
            ...validEstablishment,
          }),
        },
      );

      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toEqual({
        message: "Usuário não autorizado",
        action: "Faça login no site",
      });

      const quantity = await establishmentModel.count();
      expect(quantity).toEqual(0);
    });
  });
  describe("Auhtenticated user", () => {
    it("should not be possible to register a new establishment with invalid phone number", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/create",
        {
          method: "POST",
          body: JSON.stringify({
            ...validEstablishment,
            phone: "123456789",
          }),
          headers: { cookie },
        },
      );

      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({
        action:
          "Informe um telefone válido seguindo a seguinte estrutura: (XX)XXXXX-XXXX",
        message: "Telefone inválido",
      });

      const quantity = await establishmentModel.count();
      expect(quantity).toEqual(0);
    });

    it("should not be possible to register a new establishment with invalid email", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/create",
        {
          method: "POST",
          body: JSON.stringify({
            ...validEstablishment,
            email: "asdasd",
          }),
          headers: { cookie },
        },
      );

      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({
        action:
          "Informe um email válido seguindo a seguinte estrutura: XXXX@XXXX.XXX",
        message: "Email inválido",
      });

      const quantity = await establishmentModel.count();
      expect(quantity).toEqual(0);
    });

    it("should not be possible to register a new establishment with invalid CEP", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/create",
        {
          method: "POST",
          body: JSON.stringify({
            ...validEstablishment,
            cep: "7180000",
          }),
          headers: { cookie },
        },
      );

      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({
        action:
          "Informe um CEP válido seguindo a seguinte estrutura: XXXXX-XXX",
        message: "CEP inválido",
      });

      const quantity = await establishmentModel.count();
      expect(quantity).toEqual(0);
    });

    it("should not be possible to register a new establishment with invalid Latitude", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/create",
        {
          method: "POST",
          body: JSON.stringify({
            ...validEstablishment,
            lat: "-95.123456",
          }),
          headers: { cookie },
        },
      );

      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({
        action: "Informe uma coordenada válida",
        message: "Latitude inválida",
      });

      const quantity = await establishmentModel.count();
      expect(quantity).toEqual(0);
    });

    it("should not be possible to register a new establishment with invalid Longitude", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/create",
        {
          method: "POST",
          body: JSON.stringify({
            ...validEstablishment,
            lng: "200.543210",
          }),
          headers: { cookie },
        },
      );

      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({
        action: "Informe uma coordenada válida",
        message: "Longitude inválida",
      });

      const quantity = await establishmentModel.count();
      expect(quantity).toEqual(0);
    });

    it("should be possible to register a new establishment with a valid data", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/create",
        {
          method: "POST",
          body: JSON.stringify(validEstablishment),
          headers: { cookie },
        },
      );

      const createdEstablishment = await response.json();

      expect(createdEstablishment).toEqual({
        id: expect.any(String),
        author_id: author.id,
        name: "Empresa teste",
        phone: "61986548270",
        email: "teste@empresa.com",
        cep: "71800000",
        lat: "-23.550520",
        lng: "-46.633308",
        active: true,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });

      expect(Date.parse(createdEstablishment.created_at)).not.toBeNaN();
      expect(Date.parse(createdEstablishment.updated_at)).not.toBeNaN();

      const quantity = await establishmentModel.count();
      expect(quantity).toEqual(1);

      const establishmentsByAuthor = await establishmentModel.listByAuthor({
        authorId: author.id,
      });
      expect(establishmentsByAuthor.length).toEqual(1);
    });

    it("should not be possible to register a new establishment if phone is already in use by another establishment", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/create",
        {
          method: "POST",
          body: JSON.stringify({
            ...validEstablishment2,
            phone: validEstablishment.phone,
          }),
          headers: { cookie },
        },
      );

      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body).toEqual({
        action: "Informe outro telefone.",
        message:
          "O telefone fornecido já está em uso por outro estabelecimento.",
      });

      const quantity = await establishmentModel.count();
      expect(quantity).toEqual(1);
    });

    it("should not be possible to register a new establishment if email is already in use by another establishment", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/establishment/create",
        {
          method: "POST",
          body: JSON.stringify({
            ...validEstablishment2,
            email: validEstablishment.email,
          }),
          headers: { cookie },
        },
      );

      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body).toEqual({
        action: "Informe outro email.",
        message: "O email fornecido ja está em uso por outro estabelecimento.",
      });

      const quantity = await establishmentModel.count();
      expect(quantity).toEqual(1);
    });
  });
});
