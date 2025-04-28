export interface InputFindClientDTO {
  id: string;
}

export interface OutputFindClientDTO {
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