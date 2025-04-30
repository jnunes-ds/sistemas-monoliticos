import Id from "@shared/domain/value-object/id.value-object";

export interface InputAddProductFacadeDto {
  id?: Id;
  name: string
  description: string
  purchasePrice: number
  stock: number
}

export interface InputCheckStockFacadeDto {
  productId: Id
}

export interface OutputCheckStockFacadeDto {
  productId: Id;
  stock: number;
}

export default interface IProductAdmFacade {
  addProduct(input: InputAddProductFacadeDto): Promise<void>;
  checkStock(input: InputCheckStockFacadeDto): Promise<OutputCheckStockFacadeDto>;
}