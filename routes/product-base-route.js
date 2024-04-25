import { Router } from "express";
import {
   addProductManufacturedHistoryAndBase,
   deleteProductManufacturedHistoryAndBase,
   getALlProductFromBase,
   getAllProductManufacturedHistory,
   getOneProductFromBaseById,
   searchProductFromBase,
} from "../controllers/product-base-controller.js";
import authorizationToken from "../middlewares/authorizationToken.js";

const productBaseRouter = Router();

productBaseRouter.get("/all-product", authorizationToken, getALlProductFromBase);
productBaseRouter.get("/base/:id", authorizationToken, getOneProductFromBaseById);

productBaseRouter.get("/search-base", authorizationToken, searchProductFromBase);

productBaseRouter.get("/all-manufactured", authorizationToken, getAllProductManufacturedHistory);

productBaseRouter.post("/add-product/:id", authorizationToken, addProductManufacturedHistoryAndBase);

productBaseRouter.delete("/delete/:id", authorizationToken, deleteProductManufacturedHistoryAndBase);

export default productBaseRouter;
