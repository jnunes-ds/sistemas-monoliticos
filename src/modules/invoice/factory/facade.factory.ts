import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "../facade/invoice.facade";
import FindInvoiceUsecase from "../usecase/find-invoice/find-invoice.usecase";

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