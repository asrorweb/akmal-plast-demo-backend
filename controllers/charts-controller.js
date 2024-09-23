import moment from "moment-timezone";
import ProductTradeHistory from "../models/product-trade-history.js";

export const chartDaily = async (req, res, next) => {
    try {
        const startOfToday = moment.tz("Asia/Tashkent").startOf("day").toDate();

        const tradesHist = await ProductTradeHistory.find({
            createdAt: { $gte: startOfToday },
            canceled: false,
        });

        // Step 2: Aggregate Trade Summaries
        const hourlySummaries = tradesHist.reduce((acc, trade) => {
            const hour = new Date(trade.createdAt).getHours();
            if (!acc[hour]) {
                acc[hour] = 0;
            }
            acc[hour] += trade.tradeSumm;
            return acc;
        }, {});

        // Step 3: Format the Response
        const response = Object.keys(hourlySummaries).map((hour) => ({
            time: `${hour}:00`,
            tradeSumm: hourlySummaries[hour],
        }));

        return res.status(200).json(response);
    } catch (error) {
        next(error);
        // ish ErrorHandlerGlobal.js da davom etyapti
        // work in progress at ErrorHandlerGlobal.js
    }
};

export const chartMonthly = async (req, res, next) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const tradesHist = await ProductTradeHistory.find({
            createdAt: { $gte: startOfMonth, $lt: today },
            canceled: false,
        });

        // Step 2: Aggregate Trade Summaries
        const dailySummaries = tradesHist.reduce((acc, trade) => {
            const day = new Date(trade.createdAt).getDate();
            if (!acc[day]) {
                acc[day] = 0;
            }
            acc[day] += trade.tradeSumm;
            return acc;
        }, {});

        // Step 3: Format the Response
        const response = Object.keys(dailySummaries).map((day) => ({
            time: `${day}-${today.getMonth() + 1}-${today.getFullYear()}`,
            tradeSumm: dailySummaries[day],
        }));

        return res.status(200).json(response);
    } catch (error) {
        next(error);
        // ish ErrorHandlerGlobal.js da davom etyapti
        // work in progress at ErrorHandlerGlobal.js
    }
};

export const chartYear = async (req, res, next) => {
    try {
        // Step 1: Get the start of the year
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);

        // Step 2: Query trade history from the beginning of the year to now
        const tradesHist = await ProductTradeHistory.find({
            createdAt: { $gte: startOfYear },
            canceled: false,
        });

        // Step 3: Aggregate Trade Summaries by month
        const monthlySummaries = tradesHist.reduce((acc, trade) => {
            const month = new Date(trade.createdAt).getMonth();
            if (!acc[month]) {
                acc[month] = 0;
            }
            acc[month] += trade.tradeSumm;
            return acc;
        }, {});

        // Step 4: Format the Response
        const response = Object.keys(monthlySummaries).map((month) => ({
            time: new Date(2024, month).toLocaleString("default", {
                month: "long",
            }),
            tradeSumm: monthlySummaries[month],
        }));

        return res.status(200).json(response);
    } catch (error) {
        next(error);
        // work in progress at ErrorHandlerGlobal.js
    }
};

export const getTodayTradeSum = async (req, res, next) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const result = await ProductTradeHistory.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                    canceled: false, // Add this condition to filter out canceled trades
                },
            },
            {
                $group: {
                    _id: null,
                    totalTradeSum: { $sum: "$tradeSumm" },
                },
            },
        ]);

        return res
            .status(200)
            .json(result.length > 0 ? result[0].totalTradeSum : 0);
    } catch (error) {
        next(error);
        // work in progress at ErrorHandlerGlobal.js
    }
};

export const getTodayClientSumm = async (req, res, next) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const result = await ProductTradeHistory.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                    canceled: false, // Add this condition to filter out canceled trades
                },
            },
            {
                $group: {
                    _id: null,
                    totalClientSumm: { $sum: "$summaFromClient" },
                },
            },
        ]);

        return res
            .status(200)
            .json(result.length > 0 ? result[0].totalClientSumm : 0);
    } catch (error) {
        next(error);
        // work in progress at ErrorHandlerGlobal.js
    }
};
