import Id from "../../../@shared/domain/value-object/id.value-object";

export interface InputAddProductDto {
  id?: Id;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
}

export interface OutputAddProductDto {
  id: Id;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}