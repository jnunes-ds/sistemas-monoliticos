import express, {Express} from "express";
import {Sequelize} from "sequelize-typescript";
import {productAdmRoute} from "@product-adm/infrastructure/api/product-adm.route";
import ProductModel from "@product-adm/infrastructure/repository/sequelize/product.model";

export const app: Express = express();
app.use(express.json());
app.use("/api/v1/products", productAdmRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  })
  sequelize.addModels([ProductModel]);
  await sequelize.sync({force: true});
}
setupDb();