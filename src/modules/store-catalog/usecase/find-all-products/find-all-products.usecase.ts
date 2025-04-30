import UseCaseInterface from "@shared/usecase/use-case.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import ProductGateway from "@store-catalog/gateway/product.gateway";
import {OutputFindAllProductsDTO} from "./find-all-products.dto";

export default class FindAllProductsUseCase implements UseCaseInterface {

  constructor(private productRepository: ProductGateway) {}

  async execute(): Promise<OutputFindAllProductsDTO> {
    const products = await this.productRepository.findAll();

    return {
      products: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}