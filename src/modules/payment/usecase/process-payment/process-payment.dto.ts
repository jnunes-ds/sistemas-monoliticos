export interface InputProcessPaymentDTO {
  orderId: string;
  amount: number;
}
export interface OutputProcessPaymentDTO {
  transactionId: string;
  orderId: string;
  status: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}