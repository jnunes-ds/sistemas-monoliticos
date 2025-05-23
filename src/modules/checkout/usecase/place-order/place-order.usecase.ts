import UseCaseInterface from "@shared/usecase/use-case.interface";
import {InputPlaceOrderDTO, OutputPlaceOrderDTO} from "./place-order.dto";
import IClientAdmFacade from "@client-adm/facade/client-adm.facade.interface";
import IProductAdmFacade from "@product-adm/facade/product-adm.facade.interface";
import Id from "@shared/domain/value-object/id.value-object";
import Product from "@checkout/domain/product.entity";
import IStoreCatalogFacade from "@store-catalog/facade/store-catalog.facade.interface";
import Client from "@checkout/domain/client.entity";
import Order from "@checkout/domain/order.entity";
import IInvoiceFacade from "@invoice/facade/invoice.facade.interface";
import IPaymentFacade from "@payment/facade/facade.interface";
import CheckoutGateway from "@checkout/gateway/checkout.gateway";
import Address from "@client-adm/domain/value-object/address.value-object";
import {InputAddOrderRepository} from "@checkout/infrastructure/repository/checkout.repository.interface";


export default class PlaceOrderUsecase implements UseCaseInterface {
  constructor(
    private _repository: CheckoutGateway,
    private _clientFacade: IClientAdmFacade,
    private _productFacade: IProductAdmFacade,
    private _catalogFacade: IStoreCatalogFacade,
    private _invoiceFacade: IInvoiceFacade,
    private _paymentFacade: IPaymentFacade
  ) {}

  async execute(input: InputPlaceOrderDTO): Promise<OutputPlaceOrderDTO> {
    const client = await this._clientFacade.find({id: input.clientId});
    if (!client) {
      throw new Error("Client not found");
    }

    await this.validateProduct(input);

    const products = await Promise.all(input.products.map(product => this.getProduct(product.productId)))

    const clientObj = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: new Address({
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
      }).fullAddress,
    });

    const order = new Order({client: clientObj, products});

    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });
    payment.status === "approved" && order.approve();

    const invoice =
      payment.status === "approved"
        ? await this._invoiceFacade.generate({
            name: client.name,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            items: order.products.map((product) => ({
              id: product.id.id,
              name: product.name,
              price: product.salesPrice,
            })),
          })
        : null;

    this._repository.addOrder({
      id: order.id.id,
      clientId: client.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((product) => ({
        productId: product.id.id,
        name: product.name,
        price: product.salesPrice,
      })),
    } satisfies InputAddOrderRepository);


    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: payment.status,
      total: order.total,
      products: order.products.map((product) => ({productId: product.id.id})),
    };
  }

  private async validateProduct(input: InputPlaceOrderDTO): Promise<void> {
    if (!input?.products?.length) {
      throw new Error("No product selected");
    }

    await this.checkStock(input.products)
  }

  private async checkStock(products: { productId: string }[]) {
    for (const p of products) {
      const product = await this._productFacade.checkStock({productId: p.productId});
      if (!product.stock) {
        throw new Error(`Product ${p.productId} is out of stock`);
      }
    }
  }

  private async getProduct(prouctId: string): Promise<Product> {
    const product = await this._catalogFacade.find({id: prouctId});
    if (!product) {
      throw new Error("Product not found");
    }
    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    }
    return new Product(productProps);
  }
}