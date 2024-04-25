import { Router } from "express";
import {
   addClient,
   deleteClient,
   getAllClients,
   getClientWithId,
   searchClient,
   updateClient,
} from "../controllers/client-controller.js";
import authorizationToken from "../middlewares/authorizationToken.js";
import isAdminVerify from "../middlewares/isAdmin.js";

const clientRouter = Router();

clientRouter.get("/all", authorizationToken, getAllClients);
clientRouter.get("/:id", authorizationToken, getClientWithId);
clientRouter.get("/search", authorizationToken, searchClient);

clientRouter.post("/add-client", authorizationToken, addClient);

clientRouter.put("/update-client/:id", authorizationToken, updateClient);

clientRouter.delete("/delete-client/:id", authorizationToken, isAdminVerify, deleteClient);

export default clientRouter;
