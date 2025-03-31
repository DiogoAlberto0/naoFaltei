import { describe, it, expect, beforeEach } from "vitest";

import { resetAllDatabase } from "@/prisma/prisma";

import { establishmentModel } from "@/src/app/(back)/models/establishment";

// valid entity for tests
import { createScenario1 } from "@/src/app/(back)/tests/entitysForTest";
import { phoneUtils } from "@/src/utils/phone";
import { emailUtils } from "@/src/utils/email";
import { cepUtils } from "@/src/utils/cep";

interface ICreateEstablishmentBody {
  name: string;
  email: string;
  phone: string;
  cep: string;
  lat: string;
  lng: string;
}
const validEstablishment = {
  name: "Empresa teste",
  email: "teste@empresa.com",
  phone: "61986548270",
  cep: "71800-000",
  lat: "-23.550520",
  lng: "-46.633308",
};

let cookie: string;
let authorId: string;
let establishmentId: string;

beforeEach(async () => {
  await resetAllDatabase();

  const scenario1 = await createScenario1();
  cookie = scenario1.author.cookies;
  authorId = scenario1.author.id;
  establishmentId = scenario1.establishment.id;
});

const createEstabishmentFecth = async (
  body: ICreateEstablishmentBody,
  cookie: string,
) => {
  const response = await fetch(
    "http://localhost:3000/api/v1/establishment/create",
    {
      method: "POST",
      body: JSON.stringify({
        ...body,
      }),
      headers: {
        cookie,
      },
    },
  );

  const data = await response.json();
  return { response, data };
};

interface IExpectations {
  body: ICreateEstablishmentBody;
  cookie?: string;
  authorId: string;
  expectedStatusCode?: number;
  expectedResponseData?: any;
}
const expectations = async ({
  body,
  cookie,
  authorId,
  expectedResponseData,
  expectedStatusCode = 201,
}: IExpectations) => {
  const oldEstablishmentCounter = await establishmentModel.count();

  const { response, data } = await createEstabishmentFecth(body, cookie || "");

  const newEstablishmentCounter = await establishmentModel.count();

  expect(response.status).toStrictEqual(expectedStatusCode);

  if (response.status == 201) {
    expect(data).toStrictEqual({
      id: expect.any(String),
      name: body.name,
      phone: phoneUtils.clean(body.phone),
      email: emailUtils.normalize(body.email),
      cep: cepUtils.clean(body.cep),
      lat: body.lat,
      lng: body.lng,
      active: true,
      created_at: expect.any(String),
      updated_at: expect.any(String),
      author_id: authorId,
    });

    expect(newEstablishmentCounter).toStrictEqual(oldEstablishmentCounter + 1);
  } else {
    expect(data).toStrictEqual(expectedResponseData);
    expect(newEstablishmentCounter).toStrictEqual(oldEstablishmentCounter);
  }
};
describe("POST on `/api/v1/establishment/create`", () => {
  describe("Anonymous user", () => {
    it("should not be possible to register a new establishment if cookie is not provider", async () => {
      await expectations({
        cookie: "",
        authorId: "",
        body: validEstablishment,
        expectedStatusCode: 401,
        expectedResponseData: {
          message: "Usuário não autorizado",
          action: "Faça login no site",
        },
      });
    });
  });
  describe("Auhtenticated user", () => {
    it("should not be possible to register a new establishment with invalid phone number", async () => {
      await expectations({
        cookie: cookie,
        authorId: authorId,
        body: {
          ...validEstablishment,
          phone: "619888888",
        },
        expectedStatusCode: 400,
        expectedResponseData: {
          action:
            "Informe um telefone válido seguindo a seguinte estrutura: (XX)XXXXX-XXXX",
          message: "Telefone inválido",
        },
      });
    });

    it("should not be possible to register a new establishment with invalid email", async () => {
      await expectations({
        cookie: cookie,
        authorId: authorId,
        body: {
          ...validEstablishment,
          email: "asdasd",
        },
        expectedStatusCode: 400,
        expectedResponseData: {
          action:
            "Informe um email válido seguindo a seguinte estrutura: XXXX@XXXX.XXX",
          message: "Email inválido",
        },
      });
    });

    it("should not be possible to register a new establishment with invalid CEP", async () => {
      await expectations({
        cookie: cookie,
        authorId: authorId,
        body: {
          ...validEstablishment,
          cep: "7180000",
        },
        expectedStatusCode: 400,
        expectedResponseData: {
          action:
            "Informe um CEP válido seguindo a seguinte estrutura: XXXXX-XXX",
          message: "CEP inválido",
        },
      });
    });

    it("should not be possible to register a new establishment with invalid Latitude", async () => {
      await expectations({
        cookie: cookie,
        authorId: authorId,
        body: {
          ...validEstablishment,
          lat: "-95.123456",
        },
        expectedStatusCode: 400,
        expectedResponseData: {
          action: "Informe uma coordenada válida",
          message: "Latitude inválida",
        },
      });
    });

    it("should not be possible to register a new establishment with invalid Longitude", async () => {
      await expectations({
        cookie: cookie,
        authorId: authorId,
        body: {
          ...validEstablishment,
          lng: "200.543210",
        },
        expectedStatusCode: 400,
        expectedResponseData: {
          action: "Informe uma coordenada válida",
          message: "Longitude inválida",
        },
      });
    });

    it("should be possible to register a new establishment with a valid data", async () => {
      await expectations({
        body: validEstablishment,
        cookie,
        authorId,
      });
    });

    it("should not be possible to register a new establishment if phone is already in use by another establishment", async () => {
      const usedPhone = (
        await establishmentModel.findBy({ id: establishmentId })
      )?.phone;
      await expectations({
        cookie: cookie,
        authorId: authorId,
        body: {
          ...validEstablishment,
          phone: usedPhone || "",
        },
        expectedStatusCode: 409,
        expectedResponseData: {
          action: "Informe outro telefone.",
          message:
            "O telefone fornecido já está em uso por outro estabelecimento.",
        },
      });
    });

    it("should not be possible to register a new establishment if email is already in use by another establishment", async () => {
      const usedEmail = (
        await establishmentModel.findBy({ id: establishmentId })
      )?.email;
      await expectations({
        cookie: cookie,
        authorId: authorId,
        body: {
          ...validEstablishment,
          email: usedEmail || "",
        },
        expectedStatusCode: 409,
        expectedResponseData: {
          action: "Informe outro email.",
          message:
            "O email fornecido ja está em uso por outro estabelecimento.",
        },
      });
    });
  });
});
