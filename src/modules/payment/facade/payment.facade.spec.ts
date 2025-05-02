import {Sequelize} from "sequelize-typescript";
import TransactionModel from "@payment/infrastructure/repository/sequelize/transaction.model";
import PaymentFacadeFactory from "@payment/factory/payment.facade.factory";

describe('Payment Facade Test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: {force: true},
    });

    sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should process a payment", async () => {
    const facade = PaymentFacadeFactory.create();

    const input = {
      orderId: "order-123",
      amount: 100,
    };

    const result = await facade.process(input);

    expect(result.orderId).toEqual(input.orderId);
    expect(result.amount).toEqual(input.amount);
    expect(result.status).toEqual("approved");
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });
});