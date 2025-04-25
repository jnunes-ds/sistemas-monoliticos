import {Sequelize} from "sequelize-typescript";
import InvoiceModel from "./models/invoice.model";
import InvoiceItemModel from "./models/invoice-item.model";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/entity/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/value-object/address.value-object";
import InvoiceItem from "../domain/entity/invoice-item.entity";

describe("Invoice Repository Test", () => {
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

  it("should be able to create a new invoice", async () => {
    const item1 = new InvoiceItem({id: new Id("1"), name: "Item 1", price: 100});
    const item2 = new InvoiceItem({id: new Id("2"), name: "Item 2", price: 200});

    const invoice = new Invoice({
      id: new Id("123Abc"),
      name: "Invoice 1",
      document: "123456789",
      address: new Address({city: "City", complement: "Complement", number: "123", state: "State", street: "Street", zipCode: "ZipCode"}),
      items: [item1, item2],
    })
    const invoiceRepository = new InvoiceRepository();

    await invoiceRepository.create(invoice);

    const foundInvoice = await InvoiceModel.findOne({ where: { id: invoice.id.id } });
    expect(foundInvoice).toBeDefined();
    expect(foundInvoice?.name).toEqual(invoice.name);
    expect(foundInvoice?.document).toEqual(invoice.document);
    expect(foundInvoice.street).toEqual(invoice.address.street);
    expect(foundInvoice.number).toEqual(invoice.address.number);
    expect(foundInvoice.complement).toEqual(invoice.address.complement);
    expect(foundInvoice.city).toEqual(invoice.address.city);
    expect(foundInvoice.state).toEqual(invoice.address.state);
    expect(foundInvoice.zipCode).toEqual(invoice.address.zipCode);
  });

  it("should be able to find an invoice", async () => {
    const item1 = new InvoiceItem({id: new Id("1"), name: "Item 1", price: 100});
    const item2 = new InvoiceItem({id: new Id("2"), name: "Item 2", price: 200});

    const invoice = new Invoice({
      id: new Id("123Abc"),
      name: "Invoice 1",
      document: "123456789",
      address: new Address({city: "City", complement: "Complement", number: "123", state: "State", street: "Street", zipCode: "ZipCode"}),
      items: [item1, item2],
    })
    const invoiceRepository = new InvoiceRepository();

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

    const foundInvoice = await invoiceRepository.find(invoice.id.id);

    expect(foundInvoice).toBeDefined();
    expect(foundInvoice.name).toEqual(invoice.name);
    expect(foundInvoice.document).toEqual(invoice.document);
    expect(foundInvoice.address.street).toEqual(invoice.address.street);
    expect(foundInvoice.address.number).toEqual(invoice.address.number);
    expect(foundInvoice.address.complement).toEqual(invoice.address.complement);
    expect(foundInvoice.address.city).toEqual(invoice.address.city);
    expect(foundInvoice.address.state).toEqual(invoice.address.state);
    expect(foundInvoice.address.zipCode).toEqual(invoice.address.zipCode);
  });
});