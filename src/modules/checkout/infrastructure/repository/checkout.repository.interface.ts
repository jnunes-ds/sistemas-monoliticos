export interface InputAddOrderRepository {
  id: string;
  clientId: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
    name: string;
    price: number;
  }[];
}

export interface OutputAddOrderRepository {
  id: string;
  clientId: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
    name: string;
    price: number;
  }[];
}

export interface InputFindOrderRepository {
  id: string;
}

export interface OutputFindOrderRepository {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
    name: string;
    price: number;
  }[];
}

export interface ICheckoutRepository {
  addOrder(input: InputAddOrderRepository): Promise<OutputAddOrderRepository>;
  findOrder(input: InputFindOrderRepository): Promise<OutputFindOrderRepository>;
}

