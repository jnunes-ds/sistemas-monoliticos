import UseCaseInterface from "@shared/usecase/use-case.interface";
import InvoiceGateway from "@invoice/gateway/invoice.gateway";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import {InputFindInvoiceUseCaseDTO, OutputFindInvoiceUseCaseDTO} from "./find-invoice.dto";

export default class FindInvoiceUsecase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) {}

  async execute(input: InputFindInvoiceUseCaseDTO): Promise<OutputFindInvoiceUseCaseDTO> {
    const invoice = await this.invoiceRepository.find(input.id);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return {
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
      items: invoice.items.map(item => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.items.reduce((acc, item) => acc + item.price, 0),
      createdAt: invoice.createdAt,
    }
  }
}