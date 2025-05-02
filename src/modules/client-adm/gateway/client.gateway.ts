import Client from "@client-adm/domain/entity/client.entity";


export default interface ClientGateway {
  add(clientData: Client): Promise<void>;

  find(id: string): Promise<Client>;

}