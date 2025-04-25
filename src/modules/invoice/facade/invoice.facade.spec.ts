import {Sequelize} from "sequelize-typescript";
import InvoiceModel from "../repository/models/invoice.model";
import InvoiceItemModel from "../repository/models/invoice-item.model";
import InvoiceRepository from "../repository/invoice.repository";
import InvoiceFacade from "./invoice.facade";
import GenerateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice.usecase";

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
    const invoiceRepository = new InvoiceRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUsecase(invoiceRepository);
    const invoiceFacade = new InvoiceFacade({generateInvoiceUseCase});

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
        { id: "1", name: "Item 1", price: 100 },
        { id: "2", name: "Item 2", price: 200 },
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
});