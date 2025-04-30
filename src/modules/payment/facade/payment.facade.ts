import IPaymentFacade, {InputPaymentFacadeDTO, OutputPaymentFacadeDTO} from "./facade.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import UseCaseInterface from "@shared/usecase/use-case.interface";

export default class PaymentFacade implements IPaymentFacade {

  constructor(private readonly _processPaymentUsecase: UseCaseInterface) {}

  process(input: InputPaymentFacadeDTO): Promise<OutputPaymentFacadeDTO> {
    return this._processPaymentUsecase.execute(input);
  }
}