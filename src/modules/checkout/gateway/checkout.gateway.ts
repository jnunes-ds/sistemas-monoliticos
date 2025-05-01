import {InputPlaceOrderDTO, OutputPlaceOrderDTO} from "@checkout/usecase/place-order/place-order.dto";



export default interface CheckoutGateway {
  addOrder(input: InputPlaceOrderDTO): Promise<OutputPlaceOrderDTO>;
  findOrder(input: {id: string}): Promise<OutputPlaceOrderDTO>;
}