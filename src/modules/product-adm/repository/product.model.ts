import {Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {DATE, NUMBER, STRING, UUIDV4} from "sequelize";

@Table({
  tableName: "products",
  timestamps: false,
})
export class ProductModel extends Model {
  @PrimaryKey
  @Column({allowNull: false, type: STRING})
  declare id: string;

  @Column({allowNull: false, type: STRING})
  declare name: string;

  @Column({allowNull: false, type: STRING})
  declare description: string;

  @Column({allowNull: false, type: NUMBER})
  declare purchasePrice: number;

  @Column({allowNull: false, type: NUMBER})
  declare stock: number;

  @Column({allowNull: false, type: DATE})
  declare createdAt: Date;

  @Column({allowNull: false, type: DATE})
  declare updatedAt: Date;
}