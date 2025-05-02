import Transaction from "@payment/domain/transaction";

export default interface PaymentGateway {
  save(input: Transaction): Promise<Transaction>;
}