import { Schema, model } from "mongoose";

const productTradeHistory = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: "Workers", required: true },
        client: {
            name: { type: String, default: "Мижоз" },
            number: { type: String, default: "+998" },
        },
        summaFromClient: { type: Number, required: true },
        tradeSumm: { type: Number, required: true },
        canceled: { type: Boolean, default: false },
        tradeHistory: [
            {
                name: { type: String, required: true },
                saleMater: { type: Number, required: true },
                salePrice: { type: Number, required: true },
                saleSum: { type: Number, required: true },
                productId: { type: String, required: true },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const ProductTradeHistory = model("ProductTradeHistory", productTradeHistory);
export default ProductTradeHistory;
