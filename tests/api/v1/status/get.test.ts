import { describe, expect, it } from "vitest";

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    it("should return the status of the services", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");

      expect(response.status).toEqual(200);

      const body = await response.json();

      expect(body).toEqual({
        status: {
          services: {
            postgres: {
              max_connections: expect.any(String),
              active_connections: expect.any(String),
              version: expect.any(String),
            },
          },
        },
      });
    });
  });
});
