import {Promise} from "ts-toolbelt/out/Any/Promise";
import CheckoutModel from "@checkout/infrastructure/repository/models/checkout.model";
import {
  ICheckoutRepository,
  InputAddOrderRepository, OutputAddOrderRepository, OutputFindOrderRepository
} from "@checkout/infrastructure/repository/checkout.repository.interface";
import ProductModel from "@checkout/infrastructure/repository/models/product.model";

export default class CheckoutRepository implements ICheckoutRepository {
  async addOrder(input: InputAddOrderRepository): Promise<OutputAddOrderRepository> {
    const persistCheckout = await CheckoutModel.create({
      id: input.id,
      clientId: input.clientId,
      invoiceId: input.invoiceId,
      status: input.status,
      products: input.products.map((product) => ({
        productId: product.productId,
        name: product.name,
        price: product.price,
      })),
      total: input.total,
    }, {
      include: [ProductModel],
    });

    if (!persistCheckout) {
      throw new Error("Error persisting checkout");
    }

    return {
      id: persistCheckout.id,
      clientId: persistCheckout.clientId,
      invoiceId: persistCheckout.invoiceId,
      status: persistCheckout.status,
      products: persistCheckout.products.map((product => ({
        productId: product.productId,
        name: product.name,
        price: product.price,
      }))),
      total: persistCheckout.total,
    }
  }

  async findOrder(input: { id: string }): Promise<OutputFindOrderRepository> {
    throw new Error("Not implemented");
  }
}