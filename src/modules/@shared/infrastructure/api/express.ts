import express, {Express} from "express";
import {Sequelize} from "sequelize-typescript";
import {productAdmRoute} from "@product-adm/infrastructure/api/product-adm.route";
import ProductModel from "@product-adm/infrastructure/repository/sequelize/product.model";
import {clientAdmRoute} from "@client-adm/infrastructure/api/client-adm.route";
import ClientModel from "@client-adm/infrastructure/repository/sequelize/client.model";

export const app: Express = express();
app.use(express.json());
app.use("/api/v1/products", productAdmRoute);
app.use("/api/v1/clients", clientAdmRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  })
  sequelize.addModels([ProductModel,ClientModel]);
  await sequelize.sync({force: true});
}
setupDb();