import Invoice from "@invoice/domain/entity/invoice.entity";

export default interface InvoiceGateway {
  create(input: Invoice): Promise<void>;
  find(id: string): Promise<Invoice>;
}