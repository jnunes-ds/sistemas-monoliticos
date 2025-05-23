import ProductGateway from "@store-catalog/gateway/product.gateway";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import Product from "@store-catalog/domain/product.entity";
import StoreCatalogProductModel from "./store-catalog-product.model";
import Id from "@shared/domain/value-object/id.value-object";

export default class ProductRepository implements ProductGateway {
  async findAll(): Promise<Product[]> {
    const products = await StoreCatalogProductModel.findAll();
    return products.map(product => new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    }));
  }

  async find(id: string): Promise<Product> {
    const product = await StoreCatalogProductModel.findOne({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }
    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}