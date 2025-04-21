export interface OutputFindAllProductsDTO {
  products: {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }[];
}