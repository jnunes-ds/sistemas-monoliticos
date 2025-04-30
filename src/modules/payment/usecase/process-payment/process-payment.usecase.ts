import UseCaseInterface from "@shared/usecase/use-case.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import PaymentGateway from "@payment/gateway/payment.gateway";
import {InputProcessPaymentDTO, OutputProcessPaymentDTO} from "./process-payment.dto";
import Transaction from "@payment/domain/transaction";

export default class ProcessPaymentUsecase implements UseCaseInterface {

  constructor(private readonly _transactionRepository: PaymentGateway) {}

  async execute(input: InputProcessPaymentDTO): Promise<OutputProcessPaymentDTO> {
    const transaction = new Transaction({
      amount: input.amount,
      orderId: input.orderId,
    });
    transaction.process();

    const persistTransaction = await this._transactionRepository.save(transaction);
    if (!persistTransaction) {
      throw new Error("Transaction not found");
    }

    return {
      transactionId: persistTransaction.id.id,
      orderId: persistTransaction.orderId,
      amount: persistTransaction.amount,
      status: persistTransaction.status,
      createdAt: persistTransaction.createdAt,
      updatedAt: persistTransaction.updatedAt,
    }
  }
}