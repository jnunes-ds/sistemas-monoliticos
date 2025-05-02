import {app, sequelize} from "@shared/infrastructure/api/express";
import request from "supertest";
import {InputAddClientDTO} from "@client-adm/usecase/add-client/add-client.dto";
import {v4 as uuid} from 'uuid';

describe("E2E Tests for Checkout API", () => {
  beforeEach(async () => {
    await sequelize.sync({force: true});
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should buy a product", async () => {
    const clientInput: InputAddClientDTO = {
      id: "123Abc",
      name: 'John Doe',
      email: 'johndoe@mail.com',
      address: {
        city: 'New York',
        complement: 'Apartment 1',
        number: '123',
        state: 'NY',
        street: '5th Avenue',
        zipCode: '10001',
      },
      document: '123456789',
    };

    await request(app).post("/api/v1/clients").send(clientInput);

    const productId1 = uuid();
    const productId2 = uuid();

    await request(app)
      .post("/api/v1/products")
      .send({
        id: productId1,
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10,
      });

    await request(app)
      .post("/api/v1/products")
      .send({
        id: productId2,
        name: "Product 2",
        description: "Product 2 description",
        purchasePrice: 200,
        stock: 20,
      });

    const response = await request(app)
      .post("/api/v1/checkout")
      .send({
        clientId: "123Abc",
        products: [{productId: productId1}, {productId: productId2}],
      });



    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.status).toBe("approved");
    expect(response.body.products).toEqual([
      {productId: productId1},
      {productId: productId2},
    ]);
  });
});