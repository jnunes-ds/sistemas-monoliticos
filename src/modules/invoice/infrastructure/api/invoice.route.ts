import express, {Request, Response} from "express";
import FindInvoiceUsecase from "@invoice/usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "@invoice/infrastructure/repository/sequelize/invoice.repository";
import InvoiceModel from "@invoice/infrastructure/repository/sequelize/models/invoice.model";
import InvoiceItemModel from "@invoice/infrastructure/repository/sequelize/models/invoice-item.model";

export const invoiceRoute = express.Router();

export const invoiceModules = [InvoiceModel, InvoiceItemModel];

type Req = Request<{invoiceId: string}>
type Res =  Response<{invoiceId: string} | {error: string}>;

invoiceRoute.get("/:invoiceId", async (req: Req, res: Res): Promise<void> => {
  try {
    const {invoiceId} = req.params;

    const invoiceRepository = new InvoiceRepository();
    const usecase = new FindInvoiceUsecase(invoiceRepository);

    const response = await usecase.execute({ id: invoiceId });

    res.status(200).json({
      id: response.id,
      name: response.name,
      document: response.document,
      address: {
        street: response.address.street,
        number: response.address.number,
        complement: response.address.complement,
        city: response.address.city,
        state: response.address.state,
        zipCode: response.address.zipCode,
      },
      items: response.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
      total: response.total,
      createdAt: response.createdAt,
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error });
  }
});