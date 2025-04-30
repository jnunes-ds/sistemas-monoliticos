import {app, sequelize} from "@shared/infrastructure/api/express";
import request from "supertest";
import {InputAddClientDTO} from "@client-adm/usecase/add-client/add-client.dto";

describe("E2E Tests for Client Adm API", () => {
  beforeEach(async () => {
    await sequelize.sync({force: true});
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app)
      .post("/api/v1/clients")
      .send({
        id: "123Abc",
        name: "Test Client",
        document: "123456789",
        email: "client@mail.com",
        address: {
          street: "Test Street",
          number: "123",
          complement: "Test Complement",
          city: "Test City",
          state: "Test State",
          zipCode: "12345",
        },
      }satisfies InputAddClientDTO);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("123Abc");
  });
});