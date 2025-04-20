import IProductAdmFacade, {
  InputAddProductFacadeDto,
  InputCheckStockFacadeDto,
  OutputCheckStockFacadeDto
} from "./product-adm.facade.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";

export interface UsecaseProps {
  addUsecase: UseCaseInterface;
  checkStockUsecase: UseCaseInterface;
}

export default class ProductAdmFacade implements IProductAdmFacade {

  private _addUsecase: UseCaseInterface;
  private _checkStockUsecase: UseCaseInterface;

  constructor(usecaseProps: UsecaseProps) {
    this._addUsecase = usecaseProps.addUsecase;
    this._checkStockUsecase = usecaseProps.checkStockUsecase;
  }

  async addProduct(input: InputAddProductFacadeDto): Promise<void> {
    // Caso o DTO do caso de uso for diferente do DTO da Facade, converta o DTO
    return this._addUsecase.execute(input);
  }

  async checkStock(input: InputCheckStockFacadeDto): Promise<OutputCheckStockFacadeDto> {
    return this._checkStockUsecase.execute(input);
  }
}