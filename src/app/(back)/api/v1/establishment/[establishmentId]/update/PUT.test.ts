import { describe, it, expect, beforeEach } from "vitest";
import { omit } from "lodash";

// client
import { resetAllDatabase } from "@/prisma/prisma";

// models
import { establishmentModel } from "@/src/app/(back)/models/establishment";

//utils
import { emailUtils } from "@/src/utils/email";
import { phoneUtils } from "@/src/utils/phone";
import { cepUtils } from "@/src/utils/cep";

//valid entitys for tests
import {
  createScenario1,
  createScenario2,
} from "@/src/app/(back)/tests/entitysForTest";

let author1Cookies: string;
let validEstablishment1Id: string;
let manager1Cookies: string;

let author2Cookies: string;
let validEstablishment2Id: string;

beforeEach(async () => {
  await resetAllDatabase();

  const scenario1 = await createScenario1();
  author1Cookies = scenario1.author.cookies;
  manager1Cookies = scenario1.manager.cookie;
  validEstablishment1Id = scenario1.establishment.id;

  const scenario2 = await createScenario2();
  author2Cookies = scenario2.author.cookies;
  validEstablishment2Id = scenario2.establishment.id;
});

interface IUpdateEstablishmentData {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  cep?: string;
  ratio?: number;
  coords?: {
    lat?: string | number;
    lng?: string | number;
  };
}

interface IUpdateFetch {
  body: IUpdateEstablishmentData;
  cookie?: string;
}
const updateEstablishmentFetch = async ({
  body: { id, ...otherFields },
  cookie,
}: IUpdateFetch) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/establishment/${id}/update`,
    {
      method: "PUT",
      body: JSON.stringify({ ...otherFields }),
      headers: cookie ? { cookie } : undefined,
    },
  );

  const data = await response.json();

  return { response, data };
};

interface IExpectations extends IUpdateFetch {
  expectedStatusCode?: number;
  expectedResponseData?: any;
}
const expectations = async ({
  expectedStatusCode = 200,
  expectedResponseData,
  cookie,
  body: { id, ...updatePayload },
}: IExpectations) => {
  const oldEstablishmentData = await establishmentModel.findBy({
    id,
  });
  const oldEdtablishmentDataWithoutUpdatedAt = omit(
    oldEstablishmentData,
    "updated_at",
    "created_at",
  );

  const { response, data } = await updateEstablishmentFetch({
    body: {
      id,
      ...updatePayload,
    },
    cookie,
  });

  expect(response.status).toStrictEqual(expectedStatusCode);

  const newEstablishmentData = await establishmentModel.findBy({
    id,
  });
  const newEstablishmentDataWithoutUpdatedAt = omit(
    newEstablishmentData,
    "updated_at",
    "created_at",
  );
  if (response.status === 200) {
    const dataWithoutUpdatedAt = omit(data, "updated_at", "created_at");

    const { coords, ...otherPayloadProps } = updatePayload;

    const expectedCoords = coords
      ? {
          lat: Number(coords.lat),
          lng: Number(coords.lng),
        }
      : {};
    expect(dataWithoutUpdatedAt).toStrictEqual({
      ...oldEdtablishmentDataWithoutUpdatedAt,
      ...expectedCoords,
      ...otherPayloadProps,
      ...expectedResponseData,
    });

    expect(newEstablishmentDataWithoutUpdatedAt).toStrictEqual({
      ...oldEdtablishmentDataWithoutUpdatedAt,
      ...expectedCoords,
      ...otherPayloadProps,
      ...expectedResponseData,
    });
  } else {
    expect(data).toStrictEqual(expectedResponseData);
    expect(oldEstablishmentData).toStrictEqual(newEstablishmentData);
  }
};
describe("PUT on /api/v1/establishment/update/:ID", () => {
  describe("Authenticated author from anohter establishment", () => {
    it("should be return error if user is not author from establishment", async () => {
      await expectations({
        cookie: author2Cookies,
        body: {
          id: validEstablishment1Id,
          name: "Novo nome",
        },
        expectedStatusCode: 403,
        expectedResponseData: {
          message: "Usuário não tem permissão para fazer essa operação.",
          action: "Contate o suporte.",
        },
      });
    });
  });
  describe("Authenticated manager from establishment but arent the author", () => {
    it("should be return error if user is not author from establishment", async () => {
      await expectations({
        cookie: manager1Cookies,
        body: {
          id: validEstablishment1Id,
          name: "Novo nome",
        },
        expectedStatusCode: 403,
        expectedResponseData: {
          message: "Usuário não tem permissão para fazer essa operação.",
          action: "Contate o suporte.",
        },
      });
    });
  });
  describe("Anonymous user", () => {
    it("should be return error if user is not authenticated", async () => {
      await expectations({
        body: {
          id: validEstablishment1Id,
          name: "Novo nome",
        },
        expectedStatusCode: 401,
        expectedResponseData: {
          message: "Usuário não autorizado",
          action: "Faça login no site",
        },
      });
    });
  });
  describe("Authenticated author from establishment", () => {
    describe("UPDATE NAME TESTS", () => {
      it("should be possible to update name of an valid establishment", async () => {
        await expectations({
          body: {
            id: validEstablishment1Id,
            name: "New Establishment Name",
          },
          cookie: author1Cookies,
          expectedStatusCode: 200,
        });
      });
    });

    describe("UPDATE EMAIL TESTS", () => {
      it("should be possible to update email of an valid establishment", async () => {
        await expectations({
          body: {
            id: validEstablishment1Id,
            email: "Novo@email.com",
          },
          cookie: author1Cookies,
          expectedResponseData: {
            email: emailUtils.normalize("Novo@email.com"),
          },
        });
      });

      it("should not be possible to update if invalid email is provided", async () => {
        await expectations({
          body: {
            id: validEstablishment1Id,
            email: "asdasd",
          },
          cookie: author1Cookies,
          expectedStatusCode: 400,
          expectedResponseData: {
            message: "Email inválido",
            action:
              "Informe um email válido seguindo a seguinte estrutura: XXXX@XXXX.XXX",
          },
        });
      });

      it("should not be possible to update if provided email is already in use by another establishment", async () => {
        const usedEmail = (
          await establishmentModel.findBy({ id: validEstablishment1Id })
        )?.email;
        await expectations({
          body: {
            id: validEstablishment2Id,
            email: usedEmail,
          },
          cookie: author2Cookies,
          expectedStatusCode: 409,
          expectedResponseData: {
            message:
              "O email fornecido ja está em uso por outro estabelecimento.",
            action: "Informe outro email.",
          },
        });
      });
    });

    it("should be possible to update if provided email is already in use by the same establishment", async () => {
      const usedEmail = (
        await establishmentModel.findBy({ id: validEstablishment1Id })
      )?.email;
      await expectations({
        body: {
          id: validEstablishment1Id,
          email: usedEmail,
        },
        cookie: author1Cookies,
        expectedStatusCode: 200,
      });
    });
  });

  describe("UPDATE PHONE TESTS", () => {
    it("should be possible to update phone of an valid establishment", async () => {
      await expectations({
        body: {
          id: validEstablishment1Id,
          phone: "61900000000",
        },
        cookie: author1Cookies,
      });
    });

    it("should be possible to update phone with ponctuation of an valid establishment", async () => {
      const newPhone = "(61)90000-0000";

      await expectations({
        body: {
          id: validEstablishment1Id,
          phone: newPhone,
        },
        cookie: author1Cookies,
        expectedResponseData: {
          phone: phoneUtils.clean(newPhone),
        },
      });
    });

    it("should not be possible to update if invalid phone is provided", async () => {
      await expectations({
        body: {
          id: validEstablishment1Id,
          phone: "619888888",
        },
        cookie: author1Cookies,
        expectedStatusCode: 400,
        expectedResponseData: {
          message: "Telefone inválido",
          action:
            "Informe um telefone válido seguindo a seguinte estrutura: (XX)XXXXX-XXXX",
        },
      });
    });

    it("should not be possible to update if provided phone is already in use by another establishment", async () => {
      const usedPhone = (
        await establishmentModel.findBy({ id: validEstablishment1Id })
      )?.phone;
      await expectations({
        body: {
          id: validEstablishment2Id,
          phone: usedPhone,
        },
        cookie: author2Cookies,
        expectedStatusCode: 409,
        expectedResponseData: {
          message:
            "O telefone fornecido já está em uso por outro estabelecimento.",
          action: "Informe outro telefone.",
        },
      });
    });
  });

  describe("UPDATE CEP TESTS", () => {
    it("should be possible to update cep, if valid cep is provided", async () => {
      await expectations({
        body: {
          id: validEstablishment2Id,
          cep: "71805709",
        },
        cookie: author2Cookies,
      });
    });

    it("should be possible to update cep, if valid cep with ponctuation is provided", async () => {
      const newCep = "71805-709";
      await expectations({
        body: {
          id: validEstablishment2Id,
          cep: newCep,
        },
        cookie: author2Cookies,
        expectedResponseData: {
          cep: cepUtils.clean(newCep),
        },
      });
    });

    it("should not be possible to update cep, if invalid cep is provided", async () => {
      const newCep = "7180570";
      await expectations({
        body: {
          id: validEstablishment2Id,
          cep: newCep,
        },
        cookie: author2Cookies,
        expectedStatusCode: 400,
        expectedResponseData: {
          message: "CEP inválido",
          action:
            "Informe um CEP válido seguindo a seguinte estrutura: XXXXX-XXX",
        },
      });
    });
  });

  describe("UPDATE COORDS TESTS", () => {
    it("should be possible to update coordinates if valid latitude an longitude number is provided", async () => {
      const newLatitude = -23.55052;
      const newLongitude = -46.633308;
      await expectations({
        body: {
          id: validEstablishment2Id,
          coords: {
            lat: newLatitude,
            lng: newLongitude,
          },
        },
        cookie: author2Cookies,
      });
    });

    it("should be possible to update coordinates if valid latitude an longitude is provided", async () => {
      const newLatitude = "-23.550520";
      const newLongitude = "-46.633308";
      await expectations({
        body: {
          id: validEstablishment2Id,
          coords: {
            lat: newLatitude,
            lng: newLongitude,
          },
        },
        cookie: author2Cookies,
      });
    });

    it("should not be possible to update coordinates if invalid latitude is provided", async () => {
      const newLatitude = "100.123456";
      const newLongitude = "-46.633308";
      await expectations({
        body: {
          id: validEstablishment2Id,
          coords: {
            lat: newLatitude,
            lng: newLongitude,
          },
        },
        cookie: author2Cookies,
        expectedStatusCode: 400,
        expectedResponseData: {
          message: "Coordanadas inválidas",
          action: "Verifique as coordenadas informadas, latitude e longitude",
        },
      });
    });

    it("should not be possible to update coordinates if invalid longitude is provided", async () => {
      const newLatitude = "-23.550520";
      const newLongitude = "200.123456";
      await expectations({
        body: {
          id: validEstablishment2Id,
          coords: {
            lat: newLatitude,
            lng: newLongitude,
          },
        },
        cookie: author2Cookies,
        expectedStatusCode: 400,
        expectedResponseData: {
          message: "Coordanadas inválidas",
          action: "Verifique as coordenadas informadas, latitude e longitude",
        },
      });
    });

    it("should not be possible to update coordinates if only latitude is provided", async () => {
      const newLatitude = "-23.550520";
      await expectations({
        body: {
          id: validEstablishment2Id,
          coords: {
            lat: newLatitude,
          },
        },
        cookie: author2Cookies,
        expectedStatusCode: 400,
        expectedResponseData: {
          message: "Coordanadas inválidas",
          action: "Verifique as coordenadas informadas, latitude e longitude",
        },
      });
    });

    it("should not be possible to update coordinates if only longitude is provided", async () => {
      const newLongitude = "-46.633308";

      await expectations({
        body: {
          id: validEstablishment2Id,
          coords: {
            lng: newLongitude,
          },
        },
        cookie: author2Cookies,
        expectedStatusCode: 400,
        expectedResponseData: {
          message: "Coordanadas inválidas",
          action: "Verifique as coordenadas informadas, latitude e longitude",
        },
      });
    });
    describe("UPDATE ratio TESTS", () => {
      it("should be possible to update ratio of an valid establishment", async () => {
        await expectations({
          body: {
            id: validEstablishment1Id,
            ratio: 50,
          },
          cookie: author1Cookies,
          expectedStatusCode: 200,
        });
      });
    });
  });
});
