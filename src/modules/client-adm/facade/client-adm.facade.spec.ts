import {Sequelize} from "sequelize-typescript";
import ClientRepository from "@client-adm/infrastructure/repository/sequelize/ClientRepository";
import Id from "@shared/domain/value-object/id.value-object";
import ClientAdmFacadeFactory from "@client-adm/factory/facade.factory";
import ClientModel from "@client-adm/infrastructure/repository/sequelize/client.model";
import Client from "@client-adm/domain/entity/client.entity";
import Address from "@client-adm/domain/value-object/address.value-object";

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
    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "123ABC",
      name: "Test Client Name",
      document: "123456789",
      email: "test@mail.com",
      address: {
        street: "Test Street",
        number: "123",
        complement: "Test Complement",
        city: "Test City",
        state: "Test State",
        zipCode: "12345678",
      },
    }

    await facade.add(input);

    const client = await ClientModel.findOne({where: {id: input.id}});

    expect(client).toBeDefined();
    expect(client.id).toEqual(input.id);
    expect(client.name).toEqual(input.name);
    expect(client.email).toEqual(input.email);
    expect(client.street).toEqual(input.address.street);
    expect(client.number).toEqual(input.address.number);
    expect(client.city).toEqual(input.address.city);
    expect(client.state).toEqual(input.address.state);
    expect(client.zipCode).toEqual(input.address.zipCode);
  });

  it("should find a client", async () => {
    const clientRepository = new ClientRepository();
    const facade = ClientAdmFacadeFactory.create();

      await clientRepository.add(new Client({
        id: new Id("123ABC"),
        name: "Test Client Name",
        document: "123456789",
        email: "test@mail.com",
        address: new Address({
          street: "Test Address",
          number: "123",
          complement: "Test Complement",
          city: "Test City",
          state: "Test State",
          zipCode: "12345678",
        }),
      }));

    const response = await facade.find({id: "123ABC"});

    expect(response).toBeDefined();
    expect(response.id).toEqual("123ABC");
    expect(response.name).toEqual("Test Client Name");
    expect(response.email).toEqual("test@mail.com");
    expect(response.createdAt).toBeDefined();
    expect(response.updatedAt).toBeDefined();
  });
});