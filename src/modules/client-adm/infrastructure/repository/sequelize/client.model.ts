import {Column, Model, PrimaryKey, Table} from "sequelize-typescript";
import {DATE, STRING} from "sequelize";

@Table({
  tableName: "clients",
  timestamps: false,
})
export default class ClientModel extends Model {

  @PrimaryKey
  @Column({type: STRING, allowNull: false})
  declare id: string;

  @Column({type: STRING, allowNull: false})
  declare name: string;

  @Column({type: STRING, allowNull: false})
  declare document: string;

  @Column({type: STRING, allowNull: false})
  declare email: string;

  @Column({type: STRING, allowNull: false})
  declare street: string;

  @Column({type: STRING, allowNull: false})
  declare number: string;

  @Column({type: STRING, allowNull: false})
  declare complement: string;

  @Column({type: STRING, allowNull: false})
  declare city: string;

  @Column({type: STRING, allowNull: false})
  declare state: string;

  @Column({type: STRING, allowNull: false})
  declare zipCode: string;

  @Column({type: DATE, allowNull: false})
  declare createdAt: Date;

  @Column({type: DATE, allowNull: false})
  declare updatedAt: Date;
}