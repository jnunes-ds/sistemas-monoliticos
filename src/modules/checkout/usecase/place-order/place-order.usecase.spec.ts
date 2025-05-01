import PlaceOrderUsecase from "./place-order.usecase";
import {InputPlaceOrderDTO} from "./place-order.dto";
import Id from "@shared/domain/value-object/id.value-object";
import Product from "@checkout/domain/product.entity";

const mockDate = new Date(2000, 1, 1);

describe("Place Order Use Case Unit Test", () => {
  describe("ValidateProducts method", () => {
    // @ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUsecase();

    it("should throw an error when no products are selected", async () => {
      const input: InputPlaceOrderDTO = {
        clientId: "123",
        products: [],
      };

      await expect(placeOrderUseCase["validateProduct"](input)).rejects.toThrow(
        new Error("No product selected")
      );
    });

    it("should throw an error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({productId}: {productId: string}) => Promise.resolve({
          productId,
          stock: productId === "1" ? 0 : 10,
        }))
      };

      // @ts-expect-error - force set productFacade
      placeOrderUseCase["_productFacade"] = mockProductFacade;

      let input: InputPlaceOrderDTO = {
        clientId: "123",
        products: [{productId: "1"}],
      }

      await expect(placeOrderUseCase["validateProduct"](input)).rejects.toThrow(
        new Error("Product 1 is out of stock")
      );

      input = {
        clientId: "123",
        products: [{productId: "1"}, {productId: "2"}],
      }
      await expect(placeOrderUseCase["validateProduct"](input)).rejects.toThrow(
        new Error("Product 1 is out of stock")
      );
      expect(mockProductFacade.checkStock).toBeCalledTimes(2);

      input = {
        clientId: "123",
        products: [{productId: "1"}, {productId: "2"}, {productId: "3"}],
      }
      await expect(placeOrderUseCase["validateProduct"](input)).rejects.toThrow(
        new Error("Product 1 is out of stock")
      );
      expect(mockProductFacade.checkStock).toBeCalledTimes(3);
    });
  });

  describe("get products method", () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    // @ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUsecase();

    it("should throw error when product is not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
        findAll: jest.fn()
      }

      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      )
    });

    it("should return a product when found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(Promise.resolve({
          id: "1",
          name: "Product 1",
          description: "Product 1 description",
          salesPrice: 100,
        })),
        findAll: jest.fn()
      };

      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade

      await expect(placeOrderUseCase["getProduct"]("1")).resolves.toEqual(new Product({
        id: new Id("1"),
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
      }));
      expect(mockCatalogFacade.find).toHaveBeenCalled();
    });

  });

  describe("execute method", () => {
    it("should throw an error when client is not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
        add: jest.fn(),
      };
      // @ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUsecase();

      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: InputPlaceOrderDTO = {
        clientId: "123",
        products: [],
      }

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      )
    });

    it("should throw an error when product is not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };
      // @ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUsecase();


      // @ts-expect-error - force set clientFacade
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: InputPlaceOrderDTO = {clientId: "123", products: []}

      const response = placeOrderUseCase.execute(input);

      await expect(response).rejects.toThrow(
        new Error("No product selected")
      );
      expect(mockClientFacade.find).toBeCalledTimes(1);
    });

    describe("place an order", () => {
      const clientProps = {
        id: new Id("123"),
        name: "Client 1",
        document: "123456789",
        email: "client@mail.com",
        address: {
          street: "Street 1",
          number: "123",
          complement: "Apt 1",
          city: "City 1",
          state: "State 1",
          zipCode: "12345678",
        },
      }

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(clientProps),
        add: jest.fn(),
      };

      const mockPaymentFacade = {
        process: jest.fn()
      }

      const mockCheckoutRepository = {
        addOrder: jest.fn(),
        findOrder: jest.fn(),
      }

      const mockInvoiceFacade = {
        generate: jest.fn().mockResolvedValue(Promise.resolve({id: "1i"})),
        find: jest.fn(),
      }

      const placeorderUseCase = new PlaceOrderUsecase(
        mockCheckoutRepository,
        mockClientFacade,
        null,
        null,
        mockInvoiceFacade,
        mockPaymentFacade
      );

      const products = {
        "1": new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "Product 1 description",
          salesPrice: 100,
        }),
        "2": new Product({
          id: new Id("2"),
          name: "Product 2",
          description: "Product 2 description",
          salesPrice: 200,
        })
      }

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeorderUseCase, "validateProduct")
        // @ts-expect-error - spy on private method
        .mockResolvedValue(true);

      const mockGetProduct = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeorderUseCase, "getProduct")
        // @ts-expect-error - spy on private method
        .mockImplementation((productId: keyof typeof products) => {
          return Promise.resolve(products[productId]);
        });

      it("sholuldn't be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "it",
          orderId: "1o",
          amount: 300,
          status: "error",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: InputPlaceOrderDTO = {
          clientId: "1c",
          products: [{productId: "1"}, {productId: "2"}]
        }

        let output = await placeorderUseCase.execute(input);

        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(300);
        expect(output.products).toStrictEqual([{productId: "1"}, {productId: "2"}]);
        expect(mockClientFacade.find).toHaveBeenCalled();
        expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1c"});
        expect(mockValidateProducts).toHaveBeenCalled();
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total
        });
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);

      });

      it("should be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "it",
          orderId: "1o",
          amount: 300,
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: InputPlaceOrderDTO = {
          clientId: "1c",
          products: [{productId: "1"}, {productId: "2"}]
        }

        let output = await placeorderUseCase.execute(input);

        expect(output.invoiceId).toBe("1i");
        expect(output.total).toBe(300);
        expect(output.products).toStrictEqual([{productId: "1"}, {productId: "2"}]);
        expect(mockClientFacade.find).toHaveBeenCalled();
        expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1c"});
        expect(mockValidateProducts).toHaveBeenCalled();
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total
        });
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
        expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
          name: clientProps.name,
          document: clientProps.document,
          street: clientProps.address.street,
          number: clientProps.address.number,
          complement: clientProps.address.complement,
          city: clientProps.address.city,
          state: clientProps.address.state,
          zipCode: clientProps.address.zipCode,
          items: [
            {
              id: products["1"].id.id,
              name: products["1"].name,
              price: products["1"].salesPrice
            },
            {
              id: products["2"].id.id,
              name: products["2"].name,
              price: products["2"].salesPrice
            }
          ]
        });
      })

    })
  });
});