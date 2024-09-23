import { Router } from "express";
import authorizationToken from "../middlewares/authorizationToken.js";
import {
   chartDaily,
   chartMonthly,
   chartYear,
   getTodayClientSumm,
   getTodayTradeSum,
} from "../controllers/charts-controller.js";

const statisticRouter = Router();

statisticRouter.get("/chart-daily", authorizationToken, chartDaily);
statisticRouter.get("/chart-monthly", authorizationToken, chartMonthly);
statisticRouter.get("/chart-year", authorizationToken, chartYear);
statisticRouter.get("/chart-total-tradeSumm", authorizationToken, getTodayTradeSum);
statisticRouter.get("/chart-total-clientSumm", authorizationToken, getTodayClientSumm);

export default statisticRouter;
