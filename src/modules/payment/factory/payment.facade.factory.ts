import IPaymentFacade from "@payment/facade/facade.interface";
import TransactionRepository from "@payment/infrastructure/repository/sequelize/transaction.repository";
import ProcessPaymentUsecase from "@payment/usecase/process-payment/process-payment.usecase";
import PaymentFacade from "@payment/facade/payment.facade";

export default class PaymentFacadeFactory {
  static create(): IPaymentFacade {
    const transactionRepository = new TransactionRepository();
    const usecase = new ProcessPaymentUsecase(transactionRepository);
    return new PaymentFacade(usecase);
  }
}