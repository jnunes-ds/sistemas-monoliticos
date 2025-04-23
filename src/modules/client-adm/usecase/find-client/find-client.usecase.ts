import {UsecaseProps} from "../../../product-adm/facade/product-adm.facade";
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
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}