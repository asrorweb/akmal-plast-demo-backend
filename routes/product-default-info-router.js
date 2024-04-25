import { Router } from "express";
import {
   createProductDefaultInfo,
   deleteProductDefaultInfo,
   getAllProductDefaultInfo,
   getByIdProductDefaultInfo,
   searchProductDefaultInfo,
   updateProductDefaultInfo,
} from "../controllers/product-default-info-controller.js";
import authorizationToken from "../middlewares/authorizationToken.js";
import isAdminVerify from "../middlewares/isAdmin.js";

const productRouter = Router();

productRouter.get("/all", authorizationToken, getAllProductDefaultInfo);
productRouter.get("/search", authorizationToken, searchProductDefaultInfo);
productRouter.get("/:id", authorizationToken, isAdminVerify, getByIdProductDefaultInfo);

productRouter.post("/create", authorizationToken, isAdminVerify, createProductDefaultInfo);

productRouter.delete("/delete/:id", authorizationToken, isAdminVerify, deleteProductDefaultInfo);

productRouter.put("/update/:id", authorizationToken, isAdminVerify, updateProductDefaultInfo);

export default productRouter;
