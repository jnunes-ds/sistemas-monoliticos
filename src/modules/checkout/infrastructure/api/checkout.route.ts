import express from "express";
import PlaceOrderUsecase from "@checkout/usecase/place-order/place-order.usecase";
import ClientAdmFacade from "@client-adm/facade/client-adm.facade";
import ClientAdmFacadeFactory from "@client-adm/factory/facade.factory";
import ProductAdmFacadeFactory from "@product-adm/factory/facade.factory";
import CheckoutRepository from "@checkout/infrastructure/repository/checkout.repository";
import StoreCatalogFacadeFactory from "@store-catalog/factory/facade.factory";
import InvoiceFacadeFactory from "@invoice/factory/facade.factory";
import PaymentFacadeFactory from "@payment/factory/payment.facade.factory";
import {OutputPlaceOrderDTO} from "@checkout/usecase/place-order/place-order.dto";
import Product from "@checkout/domain/product.entity";
import Id from "@shared/domain/value-object/id.value-object";
import CheckoutModel from "@checkout/infrastructure/repository/models/checkout.model";
import CheckoutProductModel from "@checkout/infrastructure/repository/models/checkout-product.model";
import StoreCatalogProductModel from "@store-catalog/infrastructure/repository/sequelize/store-catalog-product.model";

export const checkoutRoute = express.Router();

export const checkoutModules = [CheckoutModel, CheckoutProductModel]

checkoutRoute.post("/", async (req, res) => {
  try {
    const checkoutRepository = new CheckoutRepository();
    const clientAdmFacade = ClientAdmFacadeFactory.create();
    const productAdmFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const invouceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    const placeOrderUsecase = new PlaceOrderUsecase(
      checkoutRepository,
      clientAdmFacade,
      productAdmFacade,
      catalogFacade,
      invouceFacade,
      paymentFacade,
    );


    const products = req.body.products.map((product: {productId: string}) => new Product({
      id: new Id(product.productId),
      name: `${product.productId} - name`,
      salesPrice: 100,
      description: 'Product description',
    })) as Product[];

    // await Promise.all(products.map(async (product) => {
    //   await productAdmFacade.addProduct({
    //     id: product.id.id,
    //     name: product.name,
    //     description: product.description,
    //     purchasePrice: product.salesPrice - (product.salesPrice * 0.25),
    //     stock: 10,
    //   });
    // }))

    await Promise.all(products.map(async (product) => {
      await StoreCatalogProductModel.create({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
        stock: 10,
      });
    }))



    const output = await placeOrderUsecase.execute({
      clientId: req.body.clientId,
      products: req.body.products.map((product: { productId: string }) => ({
        productId: product.productId,
      })),
    });

    res.status(200).send({
      id: output.id,
      invoiceId: output.invoiceId,
      status: output.status,
      total: output.total,
      products: output.products.map((product) => ({
        productId: product.productId,
      })),
    } satisfies OutputPlaceOrderDTO);
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});