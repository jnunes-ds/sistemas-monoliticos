import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import FindAllProductsUseCase from "./find-all-products.usecase";

const product = new Product({
  id: new Id("123Abc"),
  name: "Product 1",
  description: "Product 1 description",
  salesPrice: 100,
});

const product2 = new Product({
  id: new Id("456Def"),
  name: "Product 2",
  description: "Product 2 description",
  salesPrice: 200,
});

const mockRepository = () => ({
  find: jest.fn(),
  findAll: jest.fn().mockReturnValue([product, product2]),
});

describe("Find all products use case unit test", () => {
  it("should find all products", async () => {
    const productRepository = mockRepository();
    const usacase =  new FindAllProductsUseCase(productRepository);

    const result = await usacase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();
    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe("123Abc");
    expect(result.products[0].name).toBe("Product 1");
    expect(result.products[0].description).toBe("Product 1 description");
    expect(result.products[0].salesPrice).toBe(100);
    expect(result.products[1].id).toBe("456Def");
    expect(result.products[1].name).toBe("Product 2");
    expect(result.products[1].description).toBe("Product 2 description");
  });
});