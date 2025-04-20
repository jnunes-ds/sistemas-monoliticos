import Id from "../../../@shared/domain/value-object/id.value-object";

export interface InputCheckStockDTO {
  productId: string;
}

export interface OutputCheckStockDTO {
  productId: string;
  stock: number;
}