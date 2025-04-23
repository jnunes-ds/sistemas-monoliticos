import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import ClientGateway from "../../gateway/client.gateway";
import {InputAddClientDTO, OutputAddClientDTO} from "./add-client.dto";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";

export default class AddClientUsecase implements UseCaseInterface {
  constructor(private _clientRepository: ClientGateway) {}


  async execute(input: InputAddClientDTO): Promise<OutputAddClientDTO> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      email: input.email,
      address: input.address,
    }

    const client = new Client(props);
    await this._clientRepository.add(client);

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }
  }
}