import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import {InputFindClientDTO, OutputFindClientDTO} from "./find-client.dto";
import ClientGateway from "../../gateway/client.gateway";

export default class FindClientUsecase implements UseCaseInterface {
  constructor(private _clientRepository: ClientGateway) {}

  async execute(input: InputFindClientDTO): Promise<OutputFindClientDTO> {
    const client = await this._clientRepository.find(input.id);

    if (!client) {
      throw new Error("Client not found");
    }

    return {
      id: client.id.id,
      name: client.name,
      document: client.document,
      email: client.email,
      address: {
        street: client.address.street,
        number: client.address.number,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
      },
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}