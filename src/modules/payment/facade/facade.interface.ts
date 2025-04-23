export interface InputPaymentFacadeDTO  {
  orderId: string;
  amount: number;
}

export interface OutputPaymentFacadeDTO {
  orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default interface IPaymentFacade {
  process(input: InputPaymentFacadeDTO): Promise<OutputPaymentFacadeDTO>;
}