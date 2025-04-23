import {Sequelize} from "sequelize-typescript";
import ClientRepository from "../repository/ClientRepository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import {ClientModel} from "../repository/client.model";
import ClientAdmFacade from "./client-adm.facade";

describe("Client-Adm Facade Test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const clientRepository = new ClientRepository();
    const addClientUseCase = new AddClientUsecase(clientRepository);
    const facade = new ClientAdmFacade({addClientUseCase, findClientUseCase: undefined});

    const input = {
      id: "123ABC",
      name: "Test Client Name",
      email: "test@mail.com",
      address: "Test Address",
    }

    await facade.add(input);

    const client = await ClientModel.findOne({where: {id: input.id}});

    expect(client).toBeDefined();
    expect(client.id).toEqual(input.id);
    expect(client.name).toEqual(input.name);
    expect(client.email).toEqual(input.email);
    expect(client.address).toEqual(input.address);
  });
});