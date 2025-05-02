import InvoiceRepository from "@invoice/infrastructure/repository/sequelize/invoice.repository";
import GenerateInvoiceUsecase from "@invoice/usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "@invoice/facade/invoice.facade";
import FindInvoiceUsecase from "@invoice/usecase/find-invoice/find-invoice.usecase";

export default class InvoiceFacadeFactory {
  static create() {
    const invoiceRepository = new InvoiceRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUsecase(invoiceRepository);
    const findInvoiceUseCase = new FindInvoiceUsecase(invoiceRepository);

    return new InvoiceFacade({
      generateInvoiceUseCase,
      findInvoiceUseCase
    });
  }
}