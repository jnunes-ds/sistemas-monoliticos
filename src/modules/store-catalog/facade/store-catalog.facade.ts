import IStoreCatalogFacade, {
  InputFindStoreCatalogFacadeDTO,
  OutputFindAllStoreCatalogFacadeDTO, OutputFindStoreCatalogFacadeDTO
} from "./store-catalog.facade.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import FindProductUsecase from "@store-catalog/usecase/find-product/find-product.usecase";
import FindAllProductsUseCase from "@store-catalog/usecase/find-all-products/find-all-products.usecase";

export interface UseCaseProps {
  findProductUseCase: FindProductUsecase;
  findAllProductsUseCase: FindAllProductsUseCase;
}

export default class StoreCatalogFacade implements IStoreCatalogFacade {

  private _findProductUseCase: FindProductUsecase;
  private _findAllProductsUseCase: FindAllProductsUseCase;

  constructor(props: UseCaseProps) {
    this._findProductUseCase = props.findProductUseCase;
    this._findAllProductsUseCase = props.findAllProductsUseCase;
  }

  async find(id: InputFindStoreCatalogFacadeDTO): Promise<OutputFindStoreCatalogFacadeDTO> {
    const product = await this._findProductUseCase.execute(id);
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }

  async findAll(): Promise<OutputFindAllStoreCatalogFacadeDTO> {
    const {products} = await this._findAllProductsUseCase.execute();
    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}