import express from "express";
import AddProductUseCase from "@product-adm/usecase/add-product/add-product.usecase";
import ProductRepository from "@product-adm/infrastructure/repository/sequelize/product.repository";
import ProductModel from "@product-adm/infrastructure/repository/sequelize/product.model";

export const productAdmRoute = express.Router();

export const productAdmModules = [ProductModel];

productAdmRoute.post("/", async (req, res) => {
  const usecase = new AddProductUseCase(new ProductRepository());
  try {
    const productDto = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };

    const output = await usecase.execute(productDto);

    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
})