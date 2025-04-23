import {Column, Model, PrimaryKey, Table} from "sequelize-typescript";
import {DATE, STRING} from "sequelize";

@Table({tableName: "transactions", timestamps: false})
export default class TransactionModel extends Model {

  @PrimaryKey
  @Column({type: STRING, allowNull: false})
  declare id: string;

  @Column({type: STRING, allowNull: false})
  declare orderId: string;

  @Column({type: STRING, allowNull: false})
  declare amount: number;

  @Column({type: STRING, allowNull: false})
  declare status: string;

  @Column({type: DATE, allowNull: false})
  declare createdAt: Date;

  @Column({type: DATE, allowNull: false})
  declare updatedAt: Date;

}