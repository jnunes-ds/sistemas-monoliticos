import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import {InputPlaceOrderDTO, OutputPlaceOrderDTO} from "./place-order.dto";
import IClientAdmFacade from "../../../client-adm/facade/client-adm.facade.interface";
import IProductAdmFacade from "../../../product-adm/facade/product-adm.facade.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import IStoreCatalogFacade from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import IInvoiceFacade from "../../../invoice/facade/invoice.facade.interface";
import IPaymentFacade from "../../../payment/facade/facade.interface";
import CheckoutGateway from "../../gateway/checkout.gateway";
import Address from "../../../client-adm/domain/value-object/address.value-object";


export default class PlaceOrderUsecase implements UseCaseInterface {
  constructor(
    private _clientFacade: IClientAdmFacade,
    private _productFacade: IProductAdmFacade,
    private _catalogFacade: IStoreCatalogFacade,
    private _repository: CheckoutGateway,
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

    payment.status === "approved" && order.approve();
    this._repository.addOrder({
      clientId: order.client.id.id,
      products: order.products.map((product) => ({
        productId: product.id.id,
        name: product.name,
        price: product.salesPrice,
      })),
    });


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
      const product = await this._productFacade.checkStock({productId: new Id(p.productId)});
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