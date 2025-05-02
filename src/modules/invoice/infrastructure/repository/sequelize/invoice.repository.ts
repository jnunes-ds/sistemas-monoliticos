import InvoiceGateway from "@invoice/gateway/invoice.gateway";
import Invoice from "@invoice/domain/entity/invoice.entity";
import InvoiceModel from "./models/invoice.model";
import InvoiceItemModel from "./models/invoice-item.model";
import Id from "@shared/domain/value-object/id.value-object";
import Address from "@invoice/domain/value-object/address.value-object";
import InvoiceItem from "@invoice/domain/entity/invoice-item.entity";

export default class InvoiceRepository implements InvoiceGateway {
  async create(input: Invoice): Promise<void> {
    if (!input.address.street) {
      return;
    }
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
      items: input.items.map(item => ({
        id: item.id.id,
        invoiceId: input.id.id,
        name: item.name,
        price: item.price,
      }))
    }, {
      include: [InvoiceItemModel]
    });
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({where: {id}});

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const invoiceItems = await InvoiceItemModel.findAll({where: {invoiceId: invoice.id}});


    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      }),
      items: invoiceItems.map(item => new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    })
  }
}