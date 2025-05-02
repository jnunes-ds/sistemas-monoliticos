import express, {Express} from "express";
import {Sequelize} from "sequelize-typescript";
import {productAdmModules, productAdmRoute} from "@product-adm/infrastructure/api/product-adm.route";
import {clientAdmModules, clientAdmRoute} from "@client-adm/infrastructure/api/client-adm.route";
import {checkoutModules, checkoutRoute} from "@checkout/infrastructure/api/checkout.route";
import {invoiceModules} from "@invoice/infrastructure/api/models";
import {paymentModels} from "@payment/infrastructure/api/models";
import {storeCatalogModels} from "@store-catalog/infrastructure/api/models";

export const app: Express = express();
app.use(express.json());
app.use("/api/v1/products", productAdmRoute);
app.use("/api/v1/clients", clientAdmRoute);
app.use("/api/v1/checkout", checkoutRoute);

export let sequelize: Sequelize;

export async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  })
  await sequelize.addModels([
    ...checkoutModules,
    ...clientAdmModules,
    ...invoiceModules,
    ...paymentModels,
    ...productAdmModules,
    ...storeCatalogModels,
  ]);
  await sequelize.sync({force: true});
}

setupDb();