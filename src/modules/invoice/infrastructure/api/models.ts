import InvoiceModel from "@invoice/infrastructure/repository/sequelize/models/invoice.model";
import InvoiceItemModel from "@invoice/infrastructure/repository/sequelize/models/invoice-item.model";

export const invoiceModules = [InvoiceModel, InvoiceItemModel]