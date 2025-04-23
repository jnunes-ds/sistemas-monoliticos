import ClientGateway from "../gateway/client.gateway";
import Client from "../domain/client.entity";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import {ClientModel} from "./client.model";
import Id from "../../@shared/domain/value-object/id.value-object";

export default class ClientRepository implements ClientGateway {
  async add(clientData: Client): Promise<void> {
  }

  async find(id: string): Promise<Client> {
    const client = await ClientModel.findOne({where: {id}});

    if (!client) {
      throw new Error("Client not found");
    }

    return new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    })
  }
}