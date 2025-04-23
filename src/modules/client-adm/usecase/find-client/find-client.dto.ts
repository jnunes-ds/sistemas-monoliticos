export interface InputFindClientDTO {
  id: string;
}

export interface OutputFindClientDTO {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}