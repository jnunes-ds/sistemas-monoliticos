import BaseEntity from "@shared/domain/entity/base.entity";
import AggregateRoot from "@shared/domain/entity/aggregate-root.interface";
import Id from "@shared/domain/value-object/id.value-object";
import Address from "@client-adm/domain/value-object/address.value-object";
import InvoiceItem from "./invoice-item.entity";

interface InvoiceProps {
  id?: Id;
  name: string;
  document: string;
  address: Address; // value object
  items: InvoiceItem[]; // Invoice Items entity
  createdAt?: Date; // criada automaticamente
  updatedAt?: Date; // criada automaticamente
}

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: InvoiceItem[];

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
  }

  get name() {
    return this._name;
  }

  get document() {
    return this._document;
  }

  get address() {
    return this._address;
  }

  get items() {
    return this._items;
  }
}