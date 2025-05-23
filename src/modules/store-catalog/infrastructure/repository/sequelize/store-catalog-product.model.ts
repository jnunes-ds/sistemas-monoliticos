import {Column, Model, PrimaryKey, Table} from "sequelize-typescript";
import {NUMBER, STRING} from "sequelize";

@Table({
  tableName: "store-catalog-products",
  timestamps: false,
})
export default class StoreCatalogProductModel extends Model {
  @PrimaryKey
  @Column({type: STRING, allowNull: false})
  declare id: string;

  @Column({type: STRING, allowNull: false})
  declare name: string;

  @Column({type: STRING, allowNull: false})
  declare description: string;

  @Column({type: NUMBER, allowNull: false})
  declare salesPrice: number;

}