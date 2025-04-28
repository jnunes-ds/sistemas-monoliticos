import AddClientUsecase from "./add-client.usecase";

const mockRepository = () => ({
  add: jest.fn(),
  find: jest.fn(),
});

describe("Add Client Use Case Unit Test", () => {
  it("Should be able to add a client", async () => {
    const clientRepository = mockRepository();
    const addClientUseCase = new AddClientUsecase(clientRepository);

    const input = {
      name: "John Doe",
      email: "jhondoe@mail.com",
      document: "123456789",
      address: {
        street: "123 Main St",
        number: "456",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
      },
    }

    const result = await addClientUseCase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual("John Doe");
    expect(result.email).toEqual("jhondoe@mail.com");
    expect(result.address.street).toEqual("123 Main St");
    expect(result.address.number).toEqual("456");
    expect(result.address.city).toEqual("Anytown");
    expect(result.address.state).toEqual("CA");
    expect(result.address.zipCode).toEqual("12345");
  })
});