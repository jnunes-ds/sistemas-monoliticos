import Transaction from "../../domain/transaction";
import Id from "../../../@shared/domain/value-object/id.value-object";
import ProcessPaymentUsecase from "./process-payment.usecase";

const transaction: Transaction = new Transaction({
  id: new Id("123Abc"),
  orderId: "123",
  amount: 100,
  status: "approved",
});


const mockRepository = () => ({
  save: jest.fn().mockResolvedValue(Promise.resolve(transaction)),
});

const transaction2: Transaction = new Transaction({
  id: new Id("123Abc"),
  orderId: "123",
  amount: 50,
  status: "declined",
});


const mockRepository2 = () => ({
  save: jest.fn().mockResolvedValue(Promise.resolve(transaction2)),
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
    expect(result.status).toBe("approved");
  });

  it("should decline a payment if amount is less than 100", async () => {
      const paymentRepository2 = mockRepository2();
      const usecase = new ProcessPaymentUsecase(paymentRepository2);

      const input = {
        orderId: "123",
        amount: 50,
      };

      const result = await usecase.execute(input);

      expect(result).toBeDefined();
      expect(paymentRepository2.save).toHaveBeenCalled();
      expect(result.transactionId).toBe(transaction2.id.id);
      expect(result.orderId).toBe(transaction2.orderId);
      expect(result.amount).toBe(transaction2.amount);
      expect(result.status).toBe("declined");
  });
});