import { describe, it, expect } from "vitest";

describe("GET on '/api/v1/cep/:cep", () => {
  describe("Anonymous user", () => {
    it("should return address informations if valid cep without ponctuation is provided", async () => {
      const response = await fetch(
        `http://localhost:3000/api/v1/cep/${71805709}`
      );

      expect(response.status).toEqual(200);

      const data = await response.json();

      expect(data).toStrictEqual({
        address: {
          cep: "71805709",
          address_type: "QN",
          address_name: "7 Conjunto 9",
          address: "QN 7 Conjunto 9",
          state: "DF",
          district: "Riacho Fundo I",
          lat: "-15.8836701",
          lng: "-48.0211495",
          city: "Brasília",
          city_ibge: "5300108",
          ddd: "61",
        },
      });
    });

    it("should return address informations if valid cep  with ponctuation is provided", async () => {
      const response = await fetch(
        `http://localhost:3000/api/v1/cep/71805-709`
      );

      expect(response.status).toEqual(200);

      const data = await response.json();

      expect(data).toStrictEqual({
        address: {
          cep: "71805709",
          address_type: "QN",
          address_name: "7 Conjunto 9",
          address: "QN 7 Conjunto 9",
          state: "DF",
          district: "Riacho Fundo I",
          lat: "-15.8836701",
          lng: "-48.0211495",
          city: "Brasília",
          city_ibge: "5300108",
          ddd: "61",
        },
      });
    });

    it("should return error if not found informations from the provided cep", async () => {
      const response = await fetch(
        `http://localhost:3000/api/v1/cep/${71800000}`
      );

      expect(response.status).toEqual(404);

      const data = await response.json();

      expect(data).toStrictEqual({
        message: "CEP não encontrado no banco de dados",
        action:
          "Verifique se o CEP informado está correto, se estiver preencha as informações manualmente",
      });
    });

    it("should return error if invalid cep is provided", async () => {
      const response = await fetch(`http://localhost:3000/api/v1/cep/${"abc"}`);

      expect(response.status).toEqual(400);

      const data = await response.json();

      expect(data).toStrictEqual({
        message: "CEP Inválido.",
        action:
          "Informe um CEP válido seguindo a seguinte estrutura: XXXXX-XXX",
      });
    });
  });
});
