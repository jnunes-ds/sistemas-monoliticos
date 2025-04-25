import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import {InputGenerateInvoiceUseCaseDTO, OutputGenerateInvoiceUseCaseDTO} from "./generate-invoice.dto";
import InvoiceGateway from "../../gateway/invoice.gateway";
import Invoice from "../../domain/entity/invoice.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/value-object/address.value-object";
import InvoiceItem from "../../domain/entity/invoice-item.entity";

export default class GenerateInvoiceUsecase implements UseCaseInterface {
  constructor(private _invoiceRepository: InvoiceGateway) {}

  async execute(input: InputGenerateInvoiceUseCaseDTO): Promise<OutputGenerateInvoiceUseCaseDTO> {
    const address = new Address({
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode
    });

    const items = input.items.map(item => new InvoiceItem({
      id: new Id(item.id),
      name: item.name,
      price: item.price
    }));

    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address,
      items,
    });

    await this._invoiceRepository.create(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      document: invoice.document,
      items: invoice.items.map(item => ({
        id: item.id.id,
        name: item.name,
        price: item.price
      })),
      total: invoice.items.reduce((acc, item) => acc + item.price, 0),
    }
  }
}