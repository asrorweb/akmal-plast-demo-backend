import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRouter from "./routes/admin-router.js";
import ErrorHandlerGlobal from "./middlewares/ErorHandlarGlobal.js";
import connectToDatabase from "./config/connect-server.js";
import productRouter from "./routes/product-default-info-router.js";
import productBaseRouter from "./routes/product-base-route.js";
import tradeRouter from "./routes/trade-router.js";
import clientRouter from "./routes/client-router.js";
import statisticRouter from "./routes/charts-router.js";
import moment from "moment-timezone";

const app = express();

dotenv.config();

// Set the default timezone to Uzbekistan (UTC+5)
moment.tz("Asia/Tashkent");

const port = process.env.PORT || 5000;


// CORS ni faollashtirish va aniq domenni qo'yish
const corsOptions = {
    origin:"*",// Ruxsat berilgan domen
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// CORS middleware'ni qo'llash
app.use(cors(corsOptions));

// Agar siz OPTIONS so'rovlarini oldindan ishlatishni xohlasangiz
app.options('*', cors(corsOptions)); // Preflight uchun OPTIONS so'rovlariga ruxsat berish

app.use(express.json());

app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/product-base", productBaseRouter);
app.use("/api/trade", tradeRouter);
app.use("/api/client", clientRouter);
app.use("/api/statistic", statisticRouter);

//global error lar uchun function
app.use(ErrorHandlerGlobal);

app.listen(port, "0.0.0.0", async (error) => {
    if (error) return console.log("Connection error");
    await connectToDatabase();
    console.log(`⚡Server is running on http://localhost:${port}`);
});
