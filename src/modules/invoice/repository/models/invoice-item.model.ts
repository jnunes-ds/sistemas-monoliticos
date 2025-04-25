import {Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {DATE, FLOAT, STRING} from "sequelize";
import InvoiceModel from "./invoice.model";

@Table({
  tableName: "invoice_items",
  timestamps: false,
})
export default class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ type: STRING, allowNull: false })
  declare id: string;

  @ForeignKey(() => InvoiceModel)
  @Column({ type: STRING, allowNull: false })
  declare invoiceId: string;

  @Column({ type: STRING, allowNull: false })
  declare name: string;

  @Column({ type: FLOAT, allowNull: false })
  declare price: number;
}