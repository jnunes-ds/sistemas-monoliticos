import ProductRepository from "@product-adm/infrastructure/repository/sequelize/product.repository";
import AddProductUseCase from "@product-adm/usecase/add-product/add-product.usecase";
import ProductAdmFacade from "@product-adm/facade/product-adm.facade";
import CheckStockUsecase from "@product-adm/usecase/check-stock/check-stock.usecase";

export default class ProductAdmFacadeFactory {
  static create() {
    const productRepository = new ProductRepository();
    const addProductUseCase = new AddProductUseCase(productRepository);
    const checkStockUseCase = new CheckStockUsecase(productRepository);

    return new ProductAdmFacade({
      addUseCase: addProductUseCase,
      checkStockUseCase,
    });
  }
}