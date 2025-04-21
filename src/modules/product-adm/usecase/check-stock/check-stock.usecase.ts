import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import ProductGateway from "../../gateway/product.gateway";
import {InputCheckStockDTO, OutputCheckStockDTO} from "./check-stock.dto";

export default class CheckStockUsecase implements UseCaseInterface {

  private _productRepository: ProductGateway;

  constructor(productRepository: ProductGateway) {
    this._productRepository = productRepository;
  }

  async execute(input: InputCheckStockDTO): Promise<OutputCheckStockDTO> {
    const product = await this._productRepository.find(input.productId);
    return {
      productId: product.id,
      stock: product.stock,
    }
  }
};