import IProductAdmFacade, {
  InputAddProductFacadeDto,
  InputCheckStockFacadeDto,
  OutputCheckStockFacadeDto
} from "./product-adm.facade.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import UseCaseInterface from "@shared/usecase/use-case.interface";

export interface UsecaseProps {
  addUseCase?: UseCaseInterface;
  checkStockUseCase?: UseCaseInterface;
}

export default class ProductAdmFacade implements IProductAdmFacade {

  private _addUseCase: UseCaseInterface;
  private _checkStockUseCase: UseCaseInterface;

  constructor(usecaseProps: UsecaseProps) {
    this._addUseCase = usecaseProps.addUseCase;
    this._checkStockUseCase = usecaseProps.checkStockUseCase;
  }

  async addProduct(input: InputAddProductFacadeDto): Promise<void> {
    // Caso o DTO do caso de uso for diferente do DTO da Facade, converta o DTO
    return this._addUseCase.execute(input);
  }

  async checkStock(input: InputCheckStockFacadeDto): Promise<OutputCheckStockFacadeDto> {
    return this._checkStockUseCase.execute(input);
  }
}