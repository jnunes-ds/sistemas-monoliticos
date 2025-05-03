import {
  InputAddOrderRepository,
  OutputAddOrderRepository, OutputFindOrderRepository
} from "@checkout/infrastructure/repository/checkout.repository.interface";



export default interface CheckoutGateway {
  addOrder(input: InputAddOrderRepository): Promise<OutputAddOrderRepository>;
  findOrder(input: {id: string}): Promise<OutputFindOrderRepository>;
}