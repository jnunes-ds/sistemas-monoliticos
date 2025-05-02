import {Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {NUMBER, STRING} from "sequelize";
import CheckoutModel from "@checkout/infrastructure/repository/models/checkout.model";

@Table({
  tableName: 'checkout-products',
  timestamps: false,
})
export default class CheckoutProductModel extends Model {

  @PrimaryKey
  @Column({type: STRING, allowNull: false})
  declare productId: string;

  @ForeignKey(() => CheckoutModel)
  declare checkoutId: string;

  @Column({type: STRING, allowNull: false})
  declare name: string;

  @Column({type: NUMBER, allowNull: false})
  declare price: number;
}