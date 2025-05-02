import express from "express";
import AddClientUsecase from "@client-adm/usecase/add-client/add-client.usecase";
import ClientRepository from "@client-adm/infrastructure/repository/sequelize/ClientRepository";
import {InputAddClientDTO} from "@client-adm/usecase/add-client/add-client.dto";
import ClientModel from "@client-adm/infrastructure/repository/sequelize/client.model";

export const clientAdmRoute = express.Router();

export const clientAdmModules = [ClientModel];

clientAdmRoute.post("/", async (req, res) => {
  const usecase = new AddClientUsecase(new ClientRepository());

  const input: InputAddClientDTO = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    address: {
      city: req.body.address.city,
      complement: req.body.address.complement,
      number: req.body.address.number,
      state: req.body.address.state,
      street: req.body.address.street,
      zipCode: req.body.address.zipCode,
    },
    document: req.body.document,
  };

  try {
    const output = await usecase.execute(input);
    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error});
  }
})