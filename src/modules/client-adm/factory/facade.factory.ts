import ClientRepository from "@client-adm/infrastructure/repository/sequelize/ClientRepository";
import AddClientUsecase from "@client-adm/usecase/add-client/add-client.usecase";
import FindClientUsecase from "@client-adm/usecase/find-client/find-client.usecase";
import ClientAdmFacade from "@client-adm/facade/client-adm.facade";

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