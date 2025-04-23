import {Column, Model, PrimaryKey, Table} from "sequelize-typescript";
import {DATE, STRING} from "sequelize";

@Table({
  tableName: "clients",
  timestamps: false,
})
export class ClientModel extends Model {

  @PrimaryKey
  @Column({type: STRING, allowNull: false})
  declare id: string;

  @Column({type: STRING, allowNull: false})
  declare name: string;

  @Column({type: STRING, allowNull: false})
  declare email: string;

  @Column({type: STRING, allowNull: false})
  declare address: string;

  @Column({type: DATE, allowNull: false})
  declare createdAt: Date;

  @Column({type: DATE, allowNull: false})
  declare updatedAt: Date;
}