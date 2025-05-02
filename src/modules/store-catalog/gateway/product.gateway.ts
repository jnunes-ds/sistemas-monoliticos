import Product from "@store-catalog/domain/product.entity";

export default interface ProductGateway {
  findAll(): Promise<Product[]>;
  find(id: string): Promise<Product>;
}