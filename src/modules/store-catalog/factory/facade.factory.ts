import StoreCatalogFacadeInterface from "../facade/store-catalog.facade.interface";
import ProductRepository from "../repository/product.repository";
import FindProductUsecase from "../usecase/find-product/find-product.usecase";
import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import StoreCatalogFacade from "../facade/store-catalog.facade";

export default class StoreCatalogFacadeFactory {
  static create(): StoreCatalogFacadeInterface {
    const productRepository = new ProductRepository();
    const findProductUseCase = new FindProductUsecase(productRepository);
    const findAllProductsUseCase = new FindAllProductsUseCase(productRepository);

    return new StoreCatalogFacade({
      findAllProductsUseCase,
      findProductUseCase,
    });

  }
}