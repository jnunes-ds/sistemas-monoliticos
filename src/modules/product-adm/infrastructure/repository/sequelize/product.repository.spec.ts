import {Sequelize} from "sequelize-typescript";
import Product from "@product-adm/domain/product.entity";
import Id from "@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";
import ProductModel from "./product.model";

describe("Product Repository Test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productProps = {
      id: new Id("123Abc"),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    }

    const product = new Product(productProps)
    const productRepository = new ProductRepository();
    await productRepository.add(product);

    const productDb = await ProductModel.findOne({
      where: { id: productProps.id.id }
    });

    const {dataValues} = productDb;

    expect(dataValues.id).toEqual(productProps.id.id);
    expect(dataValues.name).toEqual(productProps.name);
    expect(dataValues.description).toEqual(productProps.description);
    expect(dataValues.purchasePrice).toEqual(productProps.purchasePrice);
    expect(dataValues.stock).toEqual(productProps.stock);
    expect(dataValues.createdAt).toBeDefined();
    expect(dataValues.updatedAt).toBeDefined();

  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    await ProductModel.create({
      id: "123Abc",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await productRepository.find(new Id("123Abc"));

    expect(product.id.id).toEqual("123Abc");
    expect(product.name).toEqual("Product 1");
    expect(product.description).toEqual("Product 1 description");
    expect(product.purchasePrice).toEqual(100);
    expect(product.stock).toEqual(10);
    expect(product.createdAt).toBeDefined();
    expect(product.updatedAt).toBeDefined();
  });
});