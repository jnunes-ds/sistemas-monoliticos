import {InputAddProductDto, OutputAddProductDto} from "./add-product.dto";
import Product from "@product-adm/domain/product.entity";
import ProductGateway from "@product-adm/gateway/product.gateway";

export default class AddProductUseCase {

  private _productRepository: ProductGateway;

  constructor(productRepository: ProductGateway) {
    this._productRepository = productRepository;
  }

  async execute(input: InputAddProductDto): Promise<OutputAddProductDto> {

    const props = {
      id: input.id,
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    }
    const product = new Product(props)

    await this._productRepository.add(product);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}