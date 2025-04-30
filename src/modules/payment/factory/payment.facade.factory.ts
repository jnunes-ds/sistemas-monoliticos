import IPaymentFacade from "../facade/facade.interface";
import TransactionRepository from "../infrastructure/repository/sequelize/transaction.repository";
import ProcessPaymentUsecase from "../usecase/process-payment/process-payment.usecase";
import PaymentFacade from "../facade/payment.facade";

export default class PaymentFacadeFactory {
  static create(): IPaymentFacade {
    const transactionRepository = new TransactionRepository();
    const usecase = new ProcessPaymentUsecase(transactionRepository);
    return new PaymentFacade(usecase);
  }
}