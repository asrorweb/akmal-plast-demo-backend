import { Router } from "express";
import authorizationToken from "../middlewares/authorizationToken.js";
import {
    cancelSellProduct,
    getAllTradeHistory,
    getAllTradeHistoryWithoutPagination,
    getTradeHistoryById,
    payForTradeHistory,
    sellProduct,
} from "../controllers/trade-controller.js";
import isAdminVerify from "../middlewares/isAdmin.js";

const tradeRouter = Router();

tradeRouter.get("/all-history", authorizationToken, getAllTradeHistory);

tradeRouter.get(
    "/all",
    authorizationToken,
    getAllTradeHistoryWithoutPagination
);

tradeRouter.get("/history/:id", authorizationToken, getTradeHistoryById);

tradeRouter.post("/sell", authorizationToken, sellProduct);

tradeRouter.post("/cencel/:id", authorizationToken, cancelSellProduct);

tradeRouter.put(
    "/cash-for-trade/:id",
    authorizationToken,
    isAdminVerify,
    payForTradeHistory
);

export default tradeRouter;
