import {Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {DATE, NUMBER, STRING, UUIDV4} from "sequelize";

@Table({
  tableName: "products",
  timestamps: false,
})
export default class ProductModel extends Model {
  @PrimaryKey
  @Column({type: STRING, allowNull: false})
  declare id: string;

  @Column({type: STRING, allowNull: false})
  declare name: string;

  @Column({type: STRING, allowNull: false})
  declare description: string;

  @Column({type: NUMBER, allowNull: false})
  declare purchasePrice: number;

  @Column({type: NUMBER, allowNull: false})
  declare stock: number;

  @Column({type: DATE, allowNull: false})
  declare createdAt: Date;

  @Column({type: DATE, allowNull: false})
  declare updatedAt: Date;
}