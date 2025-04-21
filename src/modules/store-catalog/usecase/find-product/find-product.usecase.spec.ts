import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import FindProductUsecase from "./find-product.usecase";

const product = new Product({
  id: new Id("123Abc"),
  name: "Product 1",
  description: "Product 1 description",
  salesPrice: 100,
});

const mockRepository = () => ({
  findAll: jest.fn(),
  find: jest.fn().mockReturnValue(Promise.resolve(product)),
});

describe("find a product use case unit test", () => {

  it("should find a product", async () => {
    const productRepository = mockRepository();
    const usecase = new FindProductUsecase(productRepository);

    const input = {
      id: "123Abc",
    };

    const result = await usecase.execute(input);

    expect(productRepository.find).toHaveBeenCalled();
    expect(result.id).toBe("123Abc");
    expect(result.name).toBe("Product 1");
    expect(result.description).toBe("Product 1 description");
    expect(result.salesPrice).toBe(100);
  });
});