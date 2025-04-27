import PlaceOrderUsecase from "./place-order.usecase";
import {InputPlaceOrderDTO} from "./place-order.dto";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";

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
        checkStock: jest.fn(({productId}: {productId: Id}) => Promise.resolve({
          productId,
          stock: productId.id === "1" ? 0 : 10,
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

      const mockValidateProduct = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProduct")
        // @ts-expect-error - not return never
        .mockRejectedValue(new Error("No product selected"));

      // @ts-expect-error - force set clientFacade
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: InputPlaceOrderDTO = {clientId: "123", products: []}

      const response = placeOrderUseCase.execute(input);

      await expect(response).rejects.toThrow(
        new Error("No product selected")
      );
      expect(mockClientFacade.find).toBeCalledTimes(1);
    });

  });
});