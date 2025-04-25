import InvoiceGateway from "../gateway/invoice.gateway";
import Invoice from "../domain/entity/invoice.entity";
import InvoiceModel from "./models/invoice.model";
import InvoiceItemModel from "./models/invoice-item.model";

export default class InvoiceRepository implements InvoiceGateway {
  async create(input: Invoice): Promise<void> {
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
        name: item.name,
        price: item.price,
      })),
    }, {
      include: [InvoiceItemModel]
    })
  }

  async find(id: string): Promise<any> {
    throw new Error("Not implemented");
  }
}