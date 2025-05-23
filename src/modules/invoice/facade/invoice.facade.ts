import IInvoiceFacade, {
  InputFindInvoiceFacadeDTO,
  InputGenerateInvoiceFacadeDTO, OutputFindInvoiceFacadeDTO,
  OutputGenerateInvoiceFacadeDTO
} from "./invoice.facade.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import UseCaseInterface from "@shared/usecase/use-case.interface";

interface UseCaseProps {
  generateInvoiceUseCase?: UseCaseInterface;
  findInvoiceUseCase?: UseCaseInterface;
}

export default class InvoiceFacade implements IInvoiceFacade {

  private _generateInvoiceUseCase: UseCaseInterface;
  private _findInvoiceUseCase: UseCaseInterface;

  constructor(props: UseCaseProps) {
    this._generateInvoiceUseCase = props.generateInvoiceUseCase;
    this._findInvoiceUseCase = props.findInvoiceUseCase;
  }

  async generate(input: InputGenerateInvoiceFacadeDTO): Promise<OutputGenerateInvoiceFacadeDTO> {
    return this._generateInvoiceUseCase.execute(input);
  }

  async find(input: InputFindInvoiceFacadeDTO): Promise<OutputFindInvoiceFacadeDTO> {
    const response = await this._findInvoiceUseCase.execute(input);

    if (!response) {
      throw new Error("Invoice not found");
    }

    return response
  }
}