import {Column, ForeignKey, HasMany, Model, PrimaryKey, Table} from "sequelize-typescript";
import {NUMBER, STRING} from "sequelize";
import ClientModel from "@client-adm/infrastructure/repository/sequelize/client.model";
import InvoiceModel from "@invoice/infrastructure/repository/sequelize/models/invoice.model";
import ProductModel from "@checkout/infrastructure/repository/models/product.model";

@Table({
  tableName: "checkout",
  timestamps: false,
})
export default class CheckoutModel extends Model {
  @PrimaryKey
  @Column({type: STRING, allowNull: false})
  declare id: string;

  @ForeignKey(() => ClientModel)
  @Column({type: STRING, allowNull: false})
  declare clientId: string;

  @ForeignKey(() => InvoiceModel)
  @Column({type: STRING, allowNull: false, unique: true})
  declare invoiceId: string;

  @Column({type: STRING, allowNull: false})
  declare status: string;

  @Column({type: NUMBER, allowNull: false})
  declare total: number;

  @HasMany(() => ProductModel)
  declare products: ProductModel[];
}