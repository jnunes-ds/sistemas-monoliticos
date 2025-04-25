import GenerateInvoiceUsecase from "./generate-invoice.usecase";



const mockInvoiceRepository = () => ({
  create: jest.fn(),
  find: jest.fn(),
});

describe("Generate Invoice Use Case - Unit Test", () => {
  it("should generate an invoice", async () => {
    const invoiceRepository = mockInvoiceRepository();
    const usecase = new GenerateInvoiceUsecase(invoiceRepository);

    const input = {
      name: "Metaquest3 128GB",
      document: "12345678900",
      street: "Rua 1",
      number: "123",
      complement: "Apto 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Metaquest3 128GB",
          price: 1500,
        },
        {
          id: "2",
          name: "External battery for metaquest3",
          price: 500,
        },
      ],
    };

    const output = await usecase.execute(input);

    expect(invoiceRepository.create).toHaveBeenCalled();
    expect(output.id).toBeDefined();
    expect(output.name).toEqual(input.name);
    expect(output.document).toEqual(input.document);
    expect(output.street).toEqual(input.street);
    expect(output.number).toEqual(input.number);
    expect(output.complement).toEqual(input.complement);
    expect(output.city).toEqual(input.city);
    expect(output.state).toEqual(input.state);
    expect(output.zipCode).toEqual(input.zipCode);
    expect(output.items).toHaveLength(2);
    expect(output.items[0].id).toEqual(input.items[0].id);
    expect(output.items[0].name).toEqual(input.items[0].name);
    expect(output.items[0].price).toEqual(input.items[0].price);
    expect(output.items[1].id).toEqual(input.items[1].id);
    expect(output.items[1].name).toEqual(input.items[1].name);
    expect(output.items[1].price).toEqual(input.items[1].price);
    expect(output.total).toEqual(input.items[0].price + input.items[1].price);
  })
});