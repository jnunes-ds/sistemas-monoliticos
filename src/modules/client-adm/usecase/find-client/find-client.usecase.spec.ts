import Client from "../../domain/client.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import FindClientUsecase from "./find-client.usecase";

const client = new Client({
  id: new Id("123ABC"),
  name: "John Doe",
  email: "johndoe@mail.com",
  address: "123 Main St",
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
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  });
});