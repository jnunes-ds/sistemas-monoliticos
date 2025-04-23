import IClientAdmFacade, {
  InputAddClientFacadeDTO,
  InputFindClientFacadeDTO,
  OutputFindClientFacadeDTO
} from "./client-adm.facade.interface";
import {Promise} from "ts-toolbelt/out/Any/Promise";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";

export interface UseCaseProps {
  findClientUseCase?: UseCaseInterface;
  addClientUseCase?: UseCaseInterface;
}

export default class ClientAdmFacade implements IClientAdmFacade {
  private _findUseCase: UseCaseInterface;
  private _addUseCase: UseCaseInterface;

  constructor(props: UseCaseProps) {
    this._findUseCase = props.findClientUseCase;
    this._addUseCase = props.addClientUseCase;
  }

  async add(input: InputAddClientFacadeDTO): Promise<void> {
    await this._addUseCase.execute(input);
  }

  async find(input: InputFindClientFacadeDTO): Promise<OutputFindClientFacadeDTO> {
    const output = await this._findUseCase.execute(input);

    return {
      id: output.id,
      name: output.name,
      email: output.email,
      address: output.address,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    }
  }
}