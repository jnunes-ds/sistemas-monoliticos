import Transaction from "../../domain/transaction";
import Id from "../../../@shared/domain/value-object/id.value-object";
import ProcessPaymentUsecase from "./process-payment.usecase";

const transaction: Transaction = new Transaction({
  id: new Id("123Abc"),
  orderId: "123",
  amount: 99.99,
});

const mockRepository = () => ({
  save: jest.fn().mockResolvedValue(Promise.resolve(transaction)),
});

describe("Process Payment Usecase Unit Test", () => {
  it("should process payment and return transaction details", async () => {
    const paymentRepository = mockRepository();
    const usecase = new ProcessPaymentUsecase(paymentRepository);

    const input = {
      orderId: "123",
      amount: 100,
    };

    const result = await usecase.execute(input);

    expect(result).toBeDefined();
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.transactionId).toBe(transaction.id.id);
    expect(result.orderId).toBe(transaction.orderId);
    expect(result.amount).toBe(transaction.amount);
    expect(result.status).toBe(transaction.status);
  });
});