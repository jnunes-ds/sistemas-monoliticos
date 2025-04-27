import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import {InputPlaceOrderDTO, OutputPlaceOrderDTO} from "./place-order.dto";
import IClientAdmFacade from "../../../client-adm/facade/client-adm.facade.interface";
import IProductAdmFacade from "../../../product-adm/facade/product-adm.facade.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import IStoreCatalogFacade from "../../../store-catalog/facade/store-catalog.facade.interface";


export default class PlaceOrderUsecase implements UseCaseInterface {
  constructor(
    private _clientFacade: IClientAdmFacade,
    private _productFacade: IProductAdmFacade,
    private _catalogFacade: IStoreCatalogFacade,
  ) {}

  async execute(input: InputPlaceOrderDTO): Promise<OutputPlaceOrderDTO> {
    const client = await this._clientFacade.find({id: input.clientId});
    if (!client) {
      throw new Error("Client not found");
    }

    await this.validateProduct(input);

    // TODO - recuperar o produto

    // TODO - criar o objeto do cliente
    // TODO - criar o objeto da order (client, products)

    // TODO - processpayment -> paymentfacade.process (orderid, amount)

    // TODO - case pagamento seja aprovado -> Gerar invoice
    // TODO - mudar statos da minha order para approved
    // TODO - retornar dto


    return {
      id: "",
      invoiceId: "",
      status: "",
      total: 0,
      products: [],
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