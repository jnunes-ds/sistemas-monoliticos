import {Sequelize} from "sequelize-typescript";
import StoreCatalogProductModel from "./store-catalog-product.model";
import ProductRepository from "./product.repository";

describe("Product repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: {force: true}
    });

    sequelize.addModels([StoreCatalogProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find all products", async () => {
    await StoreCatalogProductModel.create({
      id: "123",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    });

    await StoreCatalogProductModel.create({
      id: "456",
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 200,
    });

    const productRepository = new ProductRepository();
    const products = await productRepository.findAll();

    expect(products.length).toBe(2);
    expect(products[0].id.id).toBe("123");
    expect(products[0].name).toBe("Product 1");
    expect(products[0].description).toBe("Product 1 description");
    expect(products[0].salesPrice).toBe(100);
    expect(products[1].id.id).toBe("456");
    expect(products[1].name).toBe("Product 2");
    expect(products[1].description).toBe("Product 2 description");
    expect(products[1].salesPrice).toBe(200);
  });

  it("should find a product", async () => {
    await StoreCatalogProductModel.create({
      id: "123",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    });

    const productRepository = new ProductRepository();
    const product = await productRepository.find("123");

    expect(product.id.id).toBe("123");
    expect(product.name).toBe("Product 1");
    expect(product.description).toBe("Product 1 description");
    expect(product.salesPrice).toBe(100);
  });
});