import {InputAddClientDTO} from "../usecase/add-client/add-client.dto";
import Client from "../domain/client.entity";

export default interface ClientGateway {
  add(clientData: Client): Promise<void>;

  find(id: string): Promise<Client>;

}