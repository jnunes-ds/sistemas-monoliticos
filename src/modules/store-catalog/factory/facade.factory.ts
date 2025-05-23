import IStoreCatalogFacade from "@store-catalog/facade/store-catalog.facade.interface";
import ProductRepository from "@store-catalog/infrastructure/repository/sequelize/product.repository";
import FindProductUsecase from "@store-catalog/usecase/find-product/find-product.usecase";
import FindAllProductsUseCase from "@store-catalog/usecase/find-all-products/find-all-products.usecase";
import StoreCatalogFacade from "@store-catalog/facade/store-catalog.facade";

export default class StoreCatalogFacadeFactory {
  static create(): IStoreCatalogFacade {
    const productRepository = new ProductRepository();
    const findProductUseCase = new FindProductUsecase(productRepository);
    const findAllProductsUseCase = new FindAllProductsUseCase(productRepository);

    return new StoreCatalogFacade({
      findAllProductsUseCase,
      findProductUseCase,
    });

  }
}