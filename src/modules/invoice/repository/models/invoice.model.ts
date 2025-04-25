import {Column, HasMany, Model, PrimaryKey, Table} from "sequelize-typescript";
import {DATE, STRING} from "sequelize";
import InvoiceItemModel from "./invoice-item.model";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ type: STRING, allowNull: false })
  declare id: string;

  @Column({ type: STRING, allowNull: false })
  declare name: string;

  @Column({ type: STRING, allowNull: false })
  declare document: string;

  // Address fields
  @Column({ type: STRING, allowNull: false })
  declare street: string;

  @Column({ type: STRING, allowNull: false })
  declare number: string;

  @Column({ type: STRING, allowNull: true })
  declare complement: string;

  @Column({ type: STRING, allowNull: false })
  declare city: string;

  @Column({ type: STRING, allowNull: false })
  declare state: string;

  @Column({ type: STRING, allowNull: false })
  declare zipCode: string;

  @Column({ type: DATE, allowNull: false })
  declare createdAt: Date;

  @Column({ type: DATE, allowNull: false })
  declare updatedAt: Date;

  // Relationship with InvoiceItemModel
  @HasMany(() => InvoiceItemModel,{foreignKey:"invoiceId"})
  declare items: InvoiceItemModel[];
}