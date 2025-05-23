import {Sequelize} from "sequelize-typescript";
import StoreCatalogProductModel from "@store-catalog/infrastructure/repository/sequelize/store-catalog-product.model";
import StoreCatalogFacadeFactory from "@store-catalog/factory/facade.factory";

describe("Store Catalog Facade Test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([StoreCatalogProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a product", async () => {
    const facade =  StoreCatalogFacadeFactory.create();
    await StoreCatalogProductModel.create({
      id: "123Abc",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    });

    const result = await facade.find({id: "123Abc"});

    expect(result.id).toBe("123Abc");
    expect(result.name).toBe("Product 1");
    expect(result.description).toBe("Product 1 description");
    expect(result.salesPrice).toBe(100);

  });

  it("should find all products", async () => {
    const facade = StoreCatalogFacadeFactory.create();
    await StoreCatalogProductModel.create({
      id: "123Abc",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    });
    await StoreCatalogProductModel.create({
      id: "456Def",
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 200,
    });

    const result = await facade.findAll();

    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe("123Abc");
    expect(result.products[0].name).toBe("Product 1");
    expect(result.products[0].description).toBe("Product 1 description");
    expect(result.products[0].salesPrice).toBe(100);

    expect(result.products[1].id).toBe("456Def");
    expect(result.products[1].name).toBe("Product 2");
    expect(result.products[1].description).toBe("Product 2 description");
    expect(result.products[1].salesPrice).toBe(200);
  });
});