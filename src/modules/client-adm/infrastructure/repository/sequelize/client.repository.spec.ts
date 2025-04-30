import {Sequelize} from "sequelize-typescript";
import ClientModel from "./client.model";
import ClientRepository from "./ClientRepository";
import Id from "../../../../@shared/domain/value-object/id.value-object";
import Client from "../../../domain/entity/client.entity";
import Address from "../../../domain/value-object/address.value-object";

describe("Client Repository Test", () => {
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
    const client = new Client({
      id: new Id("123Abc"),
      name: "Test Client",
      document: "123456789",
      email: "test@mail.com",
      address: new Address({
        street: "Test Street",
        number: "123",
        complement: "Test Complement",
        city: "Test City",
        state: "Test State",
        zipCode: "12345678",
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientRepository = new ClientRepository();
    await clientRepository.add(client);

    const result = await ClientModel.findOne({ where: { id: client.id.id } });

    expect(result).toBeDefined();
    expect(result.id).toEqual(client.id.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.street).toEqual(client.address.street);
    expect(result.number).toEqual(client.address.number);
    expect(result.city).toEqual(client.address.city);
    expect(result.state).toEqual(client.address.state);
    expect(result.zipCode).toEqual(client.address.zipCode);
    expect(result.createdAt).toStrictEqual(client.createdAt);
    expect(result.updatedAt).toStrictEqual(client.updatedAt);
  });

  it("should find a client", async () => {
    const client = await ClientModel.create({
      id: "123Abc",
      name: "Test Client",
      document: "123456789",
      email: "testclient@mail.com",
      street: "Test Street",
      number: "123",
      complement: "Test Complement",
      city: "Test City",
      state: "Test State",
      zipCode: "12345678",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientRepository = new ClientRepository();
    const result = await clientRepository.find(client.id);

    expect(result.id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address.street).toEqual(client.street);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  })
});