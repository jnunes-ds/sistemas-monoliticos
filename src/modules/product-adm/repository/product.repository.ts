import Id from "modules/@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import {ProductModel} from "./product.model";

export default class ProductRepository implements ProductGateway {
    async add(product: Product): Promise<void> {
        await ProductModel.create({
          id: product.id.id,
          name: product.name,
          description: product.description,
          purchasePrice: product.purchasePrice,
          stock: product.stock,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
    }
    async find(id: Id): Promise<Product> {
        throw new Error("Method not implemented.");
    }

}