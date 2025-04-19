import {InputAddProductDto, OutputAddProductDto} from "./add-product.dto";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import ProductGateway from "../../gateway/product.gateway";

export default class AddProductUseCase {

  private _productRepository: ProductGateway;

  constructor(productRepository: ProductGateway) {
    this._productRepository = productRepository;
  }

  async execute(input: InputAddProductDto): Promise<OutputAddProductDto> {

    const props = {
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    }
    const product = new Product(props)

    this._productRepository.add(product);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}