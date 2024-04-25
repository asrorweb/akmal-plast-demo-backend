import { Router } from "express";
import {
   deleteWorker,
   getAllWorker,
   getWorker,
   getWorkerWithId,
   loginWorker,
   registerWorker,
   searchWorker,
   updateWorker,
} from "../controllers/admin-controller.js";
import authorizationToken from "../middlewares/authorizationToken.js";
import isAdminVerify from "../middlewares/isAdmin.js";

const adminRouter = Router();
adminRouter.get("/worker", authorizationToken, getWorker);
adminRouter.get("/worker/:id", authorizationToken, isAdminVerify, getWorkerWithId);
adminRouter.get("/all-worker", getAllWorker);
adminRouter.get("/search", authorizationToken, searchWorker);

adminRouter.post("/register", authorizationToken, isAdminVerify, registerWorker);
adminRouter.post("/login", loginWorker);

adminRouter.put("/update/:id", authorizationToken, isAdminVerify, updateWorker);

adminRouter.delete("/delete/:id", authorizationToken, isAdminVerify, deleteWorker);

export default adminRouter;
