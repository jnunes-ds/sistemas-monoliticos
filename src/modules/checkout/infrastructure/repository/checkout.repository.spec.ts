import {Sequelize} from "sequelize-typescript";
import Order from "@checkout/domain/order.entity";
import Id from "@shared/domain/value-object/id.value-object";
import Client from "@checkout/domain/client.entity";
import Product from "@checkout/domain/product.entity";
import CheckoutRepository from "@checkout/infrastructure/repository/checkout.repository";
import Invoice from "@invoice/domain/entity/invoice.entity";
import Address from "@client-adm/domain/value-object/address.value-object";
import InvoiceAddress from "@invoice/domain/value-object/address.value-object";
import InvoiceItem from "@invoice/domain/entity/invoice-item.entity";
import CheckoutModel from "@checkout/infrastructure/repository/models/checkout.model";
import ProductModel from "@checkout/infrastructure/repository/models/product.model";

describe("Checkout Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: {force: true},
    });

    sequelize.addModels([CheckoutModel, ProductModel])
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should place an order", async () => {

    const address = new Address({
      street: "Rua do john",
      number: "123",
      complement: "Apto 1",
      city: "São Paulo",
      state: "SP",
      zipCode: "12345678",
    })
    const client = new Client({
      id: new Id("123Client"),
      name: "John Doe",
      email: "johndoe@mail.com",
      address: address.fullAddress,
    });
    const product1 = new Product({
      id: new Id("123Product"),
      name: "Product 1",
      salesPrice: 100,
      description: "Product 1 description",
    });
    const product2 = new Product({
      id: new Id("456Product"),
      name: "Product 2",
      salesPrice: 200,
      description: "Product 2 description",
    });
    const order = new Order({
      id: new Id("123Abc"),
      client,
      products: [product1, product2],
    });

    order.approve();

    const invoiceAddress = new InvoiceAddress({
      street: "Rua do john",
      number: "123",
      complement: "Apto 1",
      city: "São Paulo",
      state: "SP",
      zipCode: "12345678",

    })

    const invoice = new Invoice({
      id: new Id("123Invoice"),
      name: order.products.map(item => item.name).join(", "),
      items: order.products.map(item => new InvoiceItem({
        id: new Id(item.id.id),
        name: item.name,
        price: item.salesPrice,
      })),
      address: invoiceAddress,
      document: "123456789",
    });

    const repository = new CheckoutRepository();
    const response = await repository.addOrder({
      id: new Id("123Order").id,
      clientId: order.client.id.id,
      invoiceId: invoice.id.id,
      products: order.products.map((product) => ({
        productId: product.id.id,
        name: product.name,
        price: product.salesPrice,
      })),
      total: order.total,
      status: order.status,
    });

    expect(response.id).toStrictEqual(order.id.id);
    expect(response.clientId).toStrictEqual(order.client.id);
    expect(response.products).toStrictEqual(order.products);
    expect(response.status).toEqual(order.status);

  });
});