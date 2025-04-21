import ProductGateway from "../../gateway/product.gateway";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import {OutputFindProductDTO} from "./find-product.dto";

export default class FindProductUsecase implements UseCaseInterface {
  constructor(private readonly productRepository: ProductGateway) {}

  async execute(input: any): Promise<OutputFindProductDTO> {
    const product = await this.productRepository.find(input.id);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}