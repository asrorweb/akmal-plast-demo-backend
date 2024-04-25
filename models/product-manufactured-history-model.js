import { Schema, model } from "mongoose";

const productManefactureHistorySchema = new Schema(
   {
      name: {
         type: Schema.Types.ObjectId,
         ref: "ProductDefaultInfo",
         required: true,
      },
      meter: {
         type: Number,
         required: true,
      },
      author: {
         type: Schema.Types.ObjectId,
         ref: "Workers",
      },
   },
   {
      timestamps: true,
   }
);

const ProductManefactureHistory = model("ProductManefactureHistory", productManefactureHistorySchema);

export default ProductManefactureHistory;
