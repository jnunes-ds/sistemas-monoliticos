export interface InputFindStoreCatalogFacadeDTO {
  id: string
}

export interface OutputFindStoreCatalogFacadeDTO {
  id: string
  name: string
  description: string
  salesPrice: number
}

export interface OutputFindAllStoreCatalogFacadeDTO {
  products: {
    id: string
    name: string
    description: string
    salesPrice: number
  }[]
}

export default interface IStoreCatalogFacade {
  find(id: InputFindStoreCatalogFacadeDTO): Promise<OutputFindStoreCatalogFacadeDTO>
  findAll(): Promise<OutputFindAllStoreCatalogFacadeDTO>
}