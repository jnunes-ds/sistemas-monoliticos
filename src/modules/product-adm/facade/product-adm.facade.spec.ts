import {Sequelize} from "sequelize-typescript";
import {ProductModel} from "../repository/product.model";
import ProductAdmFacadeFactory from "../factory/facade.factory";
import Id from "../../@shared/domain/value-object/id.value-object";


describe("Product-ADM Facade Test", () => {
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
    const productAdmFacade = ProductAdmFacadeFactory.create();

    const input = {
      id: new Id ("123Abc"),
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    }

    await productAdmFacade.addProduct(input);
    const product = await ProductModel.findOne({
      where: { id: input.id.id }
    });

    expect(product).toBeDefined();
    expect(product.id).toBe(input.id.id);
    expect(product.name).toBe(input.name);
    expect(product.description).toBe(input.description);
    expect(product.purchasePrice).toBe(input.purchasePrice);
    expect(product.stock).toBe(input.stock);
  });

  it("should check product stock", async () => {
    const productAdmFacade = ProductAdmFacadeFactory.create();

    const input = {
      id: new Id("123Abc"),
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    }

    await productAdmFacade.addProduct(input);

    const product = await productAdmFacade.checkStock({productId: input.id});

    expect(product).toBeDefined();
    expect(product.productId.id).toBe(input.id.id);
    expect(product.stock).toBe(input.stock);
  });
});