import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

export default interface ProductGateway {
  add(product: Product): Promise<void>;
  find(id: Id): Promise<Product>;
}