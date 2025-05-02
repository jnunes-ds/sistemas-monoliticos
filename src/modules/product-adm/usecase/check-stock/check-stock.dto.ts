export interface InputCheckStockDTO {
  productId: string;
}

export interface OutputCheckStockDTO {
  productId: string;
  stock: number;
}