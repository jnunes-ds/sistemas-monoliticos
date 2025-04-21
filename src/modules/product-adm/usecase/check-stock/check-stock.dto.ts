import Id from "../../../@shared/domain/value-object/id.value-object";

export interface InputCheckStockDTO {
  productId: Id;
}

export interface OutputCheckStockDTO {
  productId: Id;
  stock: number;
}