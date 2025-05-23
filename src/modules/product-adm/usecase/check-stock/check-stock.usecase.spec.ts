import Product from "@product-adm/domain/product.entity";
import Id from "@shared/domain/value-object/id.value-object";
import CheckStockUsecase from "./check-stock.usecase";

const product = new Product({
  id: new Id("123Abc"),
  name: "Product 1",
  description: "Product 1 description",
  purchasePrice: 100,
  stock: 1000,
});

const MockRepository = () => ({
  add: jest.fn(),
  find: jest.fn().mockReturnValue(Promise.resolve(product)),
});

describe("Check Stock UseCase - Unit Test", () => {
  it("should get stock of a product", async () => {
    const productRepository = MockRepository();
    const checkStockUseCase = new CheckStockUsecase(productRepository);

    const input = {productId: product.id.id};

    const result =  await checkStockUseCase.execute(input);

    expect(productRepository.find).toHaveBeenCalled();
    expect(result.productId).toEqual(product.id.id);
    expect(result.stock).toEqual(product.stock);
  });
});