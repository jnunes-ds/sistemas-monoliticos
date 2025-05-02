import {app, sequelize} from "@shared/infrastructure/api/express";
import request from "supertest";
import Invoice from "@invoice/domain/entity/invoice.entity";
import Id from "@shared/domain/value-object/id.value-object";
import Address from "@invoice/domain/value-object/address.value-object";
import InvoiceItem from "@invoice/domain/entity/invoice-item.entity";
import InvoiceRepository from "@invoice/infrastructure/repository/sequelize/invoice.repository";

describe("E2E Tests for Invoice API", () => {
  beforeAll(async () => {
    await sequelize.sync({force: true});
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should find an invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    const invoice = new Invoice({
      id: new Id("123Abc-Invoice"),
      name: "John Doe",
      document: "123456789",
      address: new Address({
        street: "5th Avenue",
        number: "123",
        complement: "Apartment 1",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      }),
      items: [new InvoiceItem({
        id: new Id("123Abc-Item"),
        name: "Product 1",
        price: 100,
      }), new InvoiceItem({
        id: new Id("123Abc-Item-2"),
        name: "Product 2",
        price: 200,
      })],
    })

    await invoiceRepository.create(invoice);


    const response = await request(app)
      .get(`/api/v1/invoices/${invoice.id.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: [
        {
          id: invoice.items[0].id.id,
          name: invoice.items[0].name,
          price: invoice.items[0].price,
        },
        {
          id: invoice.items[1].id.id,
          name: invoice.items[1].name,
          price: invoice.items[1].price,
        },
      ],
      total: 300,
      createdAt: expect.any(String),
    });
  });
});