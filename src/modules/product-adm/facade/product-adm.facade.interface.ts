import Id from "@shared/domain/value-object/id.value-object";

export interface InputAddProductFacadeDto {
  id?: string;
  name: string
  description: string
  purchasePrice: number
  stock: number
}

export interface InputCheckStockFacadeDto {
  productId: string;
}

export interface OutputCheckStockFacadeDto {
  productId: string;
  stock: number;
}

export default interface IProductAdmFacade {
  addProduct(input: InputAddProductFacadeDto): Promise<void>;
  checkStock(input: InputCheckStockFacadeDto): Promise<OutputCheckStockFacadeDto>;
}