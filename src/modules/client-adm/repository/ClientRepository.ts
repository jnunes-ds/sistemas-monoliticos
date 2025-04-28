import ClientGateway from "../gateway/client.gateway";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import ClientModel from "./client.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/entity/client.entity";
import Address from "../domain/value-object/address.value-object";

export default class ClientRepository implements ClientGateway {
  async add(clientData: Client): Promise<void> {
    console.log(clientData.address.city);
    await ClientModel.create({
      id: clientData.id.id,
      name: clientData.name,
      document: clientData.document,
      email: clientData.email,
      street: clientData.address.street,
      number: clientData.address.number,
      city: clientData.address.city,
      state: clientData.address.state,
      zipCode: clientData.address.zipCode,
      createdAt: clientData.createdAt,
      updatedAt: clientData.updatedAt,
    });
  }

  async find(id: string): Promise<Client> {
    const client = await ClientModel.findOne({where: {id}});

    if (!client) {
      throw new Error("Client not found");
    }

    return new Client({
      id: new Id(client.id),
      name: client.name,
      document: client.document,
      email: client.email,
      address: new Address({
        street: client.street,
        number: client.number,
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
      }),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    })
  }
}