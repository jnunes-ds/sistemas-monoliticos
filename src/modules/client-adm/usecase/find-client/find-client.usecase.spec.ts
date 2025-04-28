import Id from "../../../@shared/domain/value-object/id.value-object";
import FindClientUsecase from "./find-client.usecase";
import Client from "../../domain/entity/client.entity";
import Address from "../../domain/value-object/address.value-object";

const client = new Client({
  id: new Id("123ABC"),
  name: "John Doe",
  document: "123456789",
  email: "johndoe@mail.com",
  address: new Address({
    street: "123 Main St",
    number: "456",
    complement: "123456789",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
  }),
});

const mockRepository = () => ({
  add: jest.fn(),
  find: jest.fn().mockReturnValue(Promise.resolve(client)),
});


describe("Find Client Usecase", () => {
  it("should find a client", async () => {
    const clientRepository = mockRepository();
    const usecase = new FindClientUsecase(clientRepository);

    const input = {
      id: "123ABC",
    };

    const result = await usecase.execute(input);

    expect(clientRepository.find).toHaveBeenCalled();
    expect(result).toEqual({
      id: client.id.id,
      name: client.name,
      document: client.document,
      email: client.email,
      address: {
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
      },
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  });
});