import Id from "../../@shared/domain/value-object/id.value-object";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";

type TransactionProps = {
  id?: Id;
  amount: number;
  orderId: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class Transaction extends BaseEntity implements AggregateRoot {

  private _amount: number;
  private _orderId: string;
  private _status: string;

  constructor(props: TransactionProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._amount = props.amount;
    this._orderId = props.orderId;
    this._status = props.status || "pending";

    this.validate();
  }

  private validate() {
    if (this._amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
  }

  private approve(): void {
    this._status = "approved";
  }

  private decline(): void {
    this._status = "declined";
  }

  process(): void {
    if (this._amount >= 100) {
      this.approve();
    } else {
      this.decline();
    }
  }

  get amount(): number {
    return this._amount;
  }

  get orderId(): string {
    return this._orderId;
  }

  get status(): string {
    return this._status;
  }
}
