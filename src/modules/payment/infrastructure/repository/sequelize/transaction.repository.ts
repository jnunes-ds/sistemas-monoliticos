import PaymentGateway from "@payment/gateway/payment.gateway";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import Transaction from "@payment/domain/transaction";
import TransactionModel from "./transaction.model";
import Id from "@shared/domain/value-object/id.value-object";

export default class TransactionRepository implements PaymentGateway {
  async save(input: Transaction): Promise<Transaction> {
    const persistTransaction = await TransactionModel.create({
      id: input.id.id,
      orderId: input.orderId,
      amount: input.amount,
      status: input.status,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt
    });

    return new Transaction({
      id: new Id(persistTransaction.id),
      orderId: persistTransaction.orderId,
      amount: persistTransaction.amount,
      status: persistTransaction.status,
      createdAt: persistTransaction.createdAt,
      updatedAt: persistTransaction.updatedAt
    })
  }
}