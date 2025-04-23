export interface InputAddClientFacadeDTO {
  id?: string;
  name: string;
  email: string;
  address: string;
}

export interface InputFindClientFacadeDTO {
  id: string;
}

export interface OutputFindClientFacadeDTO {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export default interface IClientAdmFacade {
  add(input: InputAddClientFacadeDTO): Promise<void>;
  find(input: InputFindClientFacadeDTO): Promise<OutputFindClientFacadeDTO>;
}