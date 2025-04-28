export interface InputAddClientFacadeDTO {
  id?: string;
  name: string;
  document: string;
  email: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface InputFindClientFacadeDTO {
  id: string;
}

export interface OutputFindClientFacadeDTO {
  id: string;
  name: string;
  document: string;
  email: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default interface IClientAdmFacade {
  add(input: InputAddClientFacadeDTO): Promise<void>;
  find(input: InputFindClientFacadeDTO): Promise<OutputFindClientFacadeDTO>;
}