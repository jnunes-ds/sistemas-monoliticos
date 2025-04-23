export interface InputAddClientDTO {
  id?: string;
  name: string;
  email: string;
  address: string;
}

export interface OutputAddClientDTO {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}