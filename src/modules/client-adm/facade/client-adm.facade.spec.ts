import {Sequelize} from "sequelize-typescript";
import ClientRepository from "../repository/ClientRepository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import {ClientModel} from "../repository/client.model";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

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

  it("should find a client", async () => {
    const clientRepository = new ClientRepository();
    const findClientUseCase = new FindClientUsecase(clientRepository);
    const facade = new ClientAdmFacade({addClientUseCase: undefined, findClientUseCase});

      await clientRepository.add(new Client({
        id: new Id("123ABC"),
        name: "Test Client Name",
        email: "test@mail.com",
        address: "Test Address",
      }));

    const response = await facade.find({id: "123ABC"});

    expect(response).toBeDefined();
    expect(response.id).toEqual("123ABC");
    expect(response.name).toEqual("Test Client Name");
    expect(response.email).toEqual("test@mail.com");
    expect(response.address).toEqual("Test Address");
    expect(response.createdAt).toBeDefined();
    expect(response.updatedAt).toBeDefined();
  });
});