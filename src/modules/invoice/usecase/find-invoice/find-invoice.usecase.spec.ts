import InvoiceItem from "@invoice/domain/entity/invoice-item.entity";
import Id from "@shared/domain/value-object/id.value-object";
import Invoice from "@invoice/domain/entity/invoice.entity";
import Address from "@invoice/domain/value-object/address.value-object";
import FindInvoiceUsecase from "./find-invoice.usecase";

const item1 = new InvoiceItem({
  id: new Id("1"),
  name: "Metaquest3 128GB",
  price: 1500,
});

const item2 = new InvoiceItem({
  id: new Id("2"),
  name: "External battery for metaquest3",
  price: 500,
});

const invoice = new Invoice({
  id: new Id("123Abc"),
  name: "Metaquest3 128GB",
  address: new Address({
    city: "São Paulo",
    complement: "Apto 123",
    number: "123",
    state: "SP",
    street: "Rua 1",
    zipCode: "12345678",
  }),
  items: [item1, item2],
  document: "12345678900",
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockRepository = () => ({
  create: jest.fn(),
  find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
});

describe("Find Invoice Use Case - Unit Test", () => {
  it("should find an invoice", async () => {
    const invoiceRepository = mockRepository();
    const usecase = new FindInvoiceUsecase(invoiceRepository);

    const input = {
      id: "123Abc",
    };

    const output = await usecase.execute(input);

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(output.id).toEqual(invoice.id.id);
    expect(output.name).toEqual(invoice.name);
    expect(output.document).toEqual(invoice.document);
    expect(output.address.street).toEqual(invoice.address.street);
    expect(output.address.number).toEqual(invoice.address.number);
    expect(output.address.complement).toEqual(invoice.address.complement);
    expect(output.address.city).toEqual(invoice.address.city);
    expect(output.address.state).toEqual(invoice.address.state);
    expect(output.address.zipCode).toEqual(invoice.address.zipCode);
    expect(output.items).toHaveLength(2);
    expect(output.items[0].id).toEqual(item1.id.id);
    expect(output.items[0].name).toEqual(item1.name);
    expect(output.items[0].price).toEqual(item1.price);
  })
});