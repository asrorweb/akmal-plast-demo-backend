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

const app = express();
app.use(cors());

dotenv.config();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*"); // Yoki 'http://localhost:5173' deb ham bo'lishi mumkin
   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
   next();
});

app.use(express.json());

app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/product-base", productBaseRouter);
app.use("/api/trade", tradeRouter);
app.use("/api/client", clientRouter);

//global error lar uchun function
app.use(ErrorHandlerGlobal);

app.listen(port, "0.0.0.0", async (error) => {
   if (error) return console.log("Connection error");
   await connectToDatabase();
   console.log(`⚡Server is running on http://localhost:${port}`);
});
