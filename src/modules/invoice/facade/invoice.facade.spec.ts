import {Sequelize} from "sequelize-typescript";
import InvoiceModel from "@invoice/infrastructure/repository/sequelize/models/invoice.model";
import InvoiceItemModel from "@invoice/infrastructure/repository/sequelize/models/invoice-item.model";
import Invoice from "@invoice/domain/entity/invoice.entity";
import Address from "@invoice/domain/value-object/address.value-object";
import InvoiceItem from "@invoice/domain/entity/invoice-item.entity";
import Id from "@shared/domain/value-object/id.value-object";
import InvoiceFacadeFactory from "@invoice/factory/facade.factory";

describe("Invoice Facade Test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      name: "John Doe",
      document: "123456789",
      street: "123 Main St",
      number: "456",
      complement: "Apt 789",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      items: [
        {id: "1", name: "Item 1", price: 100},
        {id: "2", name: "Item 2", price: 200},
      ],
    };

    const result = await invoiceFacade.generate(input);

    expect(result).toEqual({
      id: expect.any(String),
      name: input.name,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      items: input.items,
      total: 300,
    });
  });

  it("should find an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const address = new Address({
      street: "123 Main St",
      number: "456",
      complement: "Apt 789",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    });
    const item1 = new InvoiceItem({
      id: new Id("1"),
      name: "Item 1",
      price: 100,
    });

    const item2 = new InvoiceItem({
      id: new Id("2"),
      name: "Item 2",
      price: 200,
    });

    const invoice = new Invoice({
      name: "John Doe",
      document: "123456789",
      address,
      items: [item1, item2],
    });

    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: invoice.items.map((item) => ({
        id: item.id.id,
        invoiceId: invoice.id.id,
        name: item.name,
        price: item.price,
      }))
    }, {
      include: [InvoiceItemModel],
    });

    const result = await invoiceFacade.find({id: invoice.id.id});

    expect(result).toBeDefined();
    expect(result.id).toEqual(invoice.id.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.address.street);
    expect(result.address.number).toEqual(invoice.address.number);
    expect(result.address.complement).toEqual(invoice.address.complement);
    expect(result.address.city).toEqual(invoice.address.city);
    expect(result.address.state).toEqual(invoice.address.state);
    expect(result.address.zipCode).toEqual(invoice.address.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toEqual(item1.id.id);
    expect(result.items[0].name).toEqual(item1.name);
    expect(result.items[0].price).toEqual(item1.price);
    expect(result.items[1].id).toEqual(item2.id.id);
    expect(result.items[1].name).toEqual(item2.name);
    expect(result.items[1].price).toEqual(item2.price);
    expect(result.total).toEqual(item1.price + item2.price);
    expect(result.createdAt).toEqual(expect.any(Date));
    expect(result.createdAt).toEqual(expect.any(Date));
  })
});