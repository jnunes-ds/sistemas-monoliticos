import {app, sequelize} from "@shared/infrastructure/api/express";
import request from "supertest";

describe("E2E Tests for Product API", () => {
  beforeEach(async () => {
    await sequelize.sync({force: true});
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/api/v1/products")
      .send({
        id: "123Abc",
        name: "Test Product",
        description: "Test description",
        purchasePrice: 100,
        stock: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("123Abc");
    expect(response.body.name).toBe("Test Product");
    expect(response.body.description).toBe("Test description");
    expect(response.body.purchasePrice).toBe(100);
    expect(response.body.stock).toBe(10);
  });

});