import UseCaseInterface from "@shared/usecase/use-case.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import ClientGateway from "@client-adm/gateway/client.gateway";
import {InputAddClientDTO, OutputAddClientDTO} from "./add-client.dto";
import Id from "@shared/domain/value-object/id.value-object";
import Client from "@client-adm/domain/entity/client.entity";
import Address from "@client-adm/domain/value-object/address.value-object";

export default class AddClientUsecase implements UseCaseInterface {
  constructor(private _clientRepository: ClientGateway) {}


  async execute(input: InputAddClientDTO): Promise<OutputAddClientDTO> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      document: input.document,
      email: input.email,
      address: new Address({
        street: input.address.street,
        number: input.address.number,
        complement: input.address.complement,
        city: input.address.city,
        state: input.address.state,
        zipCode: input.address.zipCode,
      }),
    }

    const client = new Client(props);
    console.log(client);
    await this._clientRepository.add(client);


    return {
      id: client.id.id,
      name: client.name,
      document: client.document,
      email: client.email,
      address: {
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
      },
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }
  }
}