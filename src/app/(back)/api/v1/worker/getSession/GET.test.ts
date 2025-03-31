import { resetAllDatabase } from "@/prisma/prisma";
import { createScenario1 } from "@/src/app/(back)/tests/entitysForTest";
import { beforeAll, describe, it, expect } from "vitest";

let manager1Id: string;
let manager1Cookie: string;

beforeAll(async () => {
  await resetAllDatabase();
  const scenario1 = await createScenario1();
  manager1Id = scenario1.manager.id;
  manager1Cookie = scenario1.manager.cookie;
});

const sessionFetch = async (cookie: string) => {
  const response = await fetch(
    "http://localhost:3000/api/v1/worker/getSession",
    {
      method: "GET",
      headers: {
        cookie,
      },
    },
  );

  const data = await response.json();

  return { response, data };
};

const expectations = async (
  cookie: string,
  userId: string,
  isSuccefull: boolean,
) => {
  const { response, data } = await sessionFetch(cookie);

  if (isSuccefull) {
    expect(response.status).toStrictEqual(200);
    expect(data).toStrictEqual({
      session: {
        user: {
          name: expect.any(String),
          id: userId,
        },
        expires: expect.any(String),
      },
    });
  } else {
    expect(response.status).toEqual(401);
    expect(data).toStrictEqual({
      message: "Usuário não autorizado",
      action: "Contate o suporte",
    });
  }
};
describe("GET on `/api/v1/worker/getSession`", () => {
  describe("Valid manager", () => {
    it("should be return worker session if a valid manager cookie is provided", async () => {
      await expectations(manager1Cookie, manager1Id, true);
    });
  });

  describe("Valid manager", () => {
    it("should be return unauthorized error if cookie is not provided", async () => {
      await expectations("", "", false);
    });
  });

  describe("Valid manager", () => {
    it("should be return unauthorized error if invalid cookie is provided", async () => {
      const invalidCookie =
        "session=eyJ1c2VySWQiOiIxMjM0NTYifQ==; Path=/; HttpOnly; Secure";
      await expectations(invalidCookie, "", false);
    });
  });
});
