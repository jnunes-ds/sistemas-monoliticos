import {Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {DATE, NUMBER, STRING, UUIDV4} from "sequelize";

@Table({
  tableName: "products",
  timestamps: false,
})
export class ProductModel extends Model {
  @PrimaryKey
  @Column({allowNull: false, type: STRING})
  id!: string;

  @Column({allowNull: false, type: STRING})
  name!: string;

  @Column({allowNull: false, type: STRING})
  description!: string;

  @Column({allowNull: false, type: NUMBER})
  purchasePrice!: number;

  @Column({allowNull: false, type: NUMBER})
  stock!: number;

  @Column({allowNull: false, type: DATE})
  createdAt!: Date;

  @Column({allowNull: false, type: DATE})
  updatedAt!: Date;
}