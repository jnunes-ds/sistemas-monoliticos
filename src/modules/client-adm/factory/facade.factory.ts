import ClientRepository from "../repository/ClientRepository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacade from "../facade/client-adm.facade";

export default class ClientAdmFacadeFactory {
  static create() {
    const clientRepository = new ClientRepository();
    const addClientUseCase = new AddClientUsecase(clientRepository);
    const findClientUseCase = new FindClientUsecase(clientRepository);

    return new ClientAdmFacade({
      addClientUseCase,
      findClientUseCase,
    });
  }
}