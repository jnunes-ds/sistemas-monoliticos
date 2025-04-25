import {Sequelize} from "sequelize-typescript";
import InvoiceModel from "../repository/models/invoice.model";
import InvoiceItemModel from "../repository/models/invoice-item.model";
import Invoice from "../domain/entity/invoice.entity";
import Address from "../domain/value-object/address.value-object";
import InvoiceItem from "../domain/entity/invoice-item.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceFacadeFactory from "../factory/facade.factory";

describe("Invoice Facade Test", () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterAll(async () => {
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

    const input = new Invoice({
      name: "John Doe",
      document: "123456789",
      address,
      items: [item1, item2],
    });

    await InvoiceModel.create({
      id: input.id.id,
      name: input.name,
      document: input.document,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipCode: input.address.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: input.items.map((item) => ({
        id: item.id.id,
        invoiceId: input.id.id,
        name: item.name,
        price: item.price,
      }))
    }, {
      include: [InvoiceItemModel]
    });

    const result = await invoiceFacade.find({id: input.id.id});

    expect(result).toBeDefined();
    expect(result.id).toEqual(input.id.id);
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.address.street).toEqual(input.address.street);
    expect(result.address.number).toEqual(input.address.number);
    expect(result.address.complement).toEqual(input.address.complement);
    expect(result.address.city).toEqual(input.address.city);
    expect(result.address.state).toEqual(input.address.state);
    expect(result.address.zipCode).toEqual(input.address.zipCode);
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