import { Router } from "express";
import authorizationToken from "../middlewares/authorizationToken.js";
import { getAllTradeHistory, getTradeHistoryById, sellProduct } from "../controllers/trade-controller.js";

const tradeRouter = Router();

tradeRouter.get("/all-history", authorizationToken, getAllTradeHistory);
tradeRouter.get("/history/:id", authorizationToken, getTradeHistoryById);

tradeRouter.post("/sell", authorizationToken, sellProduct);

export default tradeRouter;
