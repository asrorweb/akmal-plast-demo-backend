import { Schema, model } from "mongoose";

const productDefaultInfoSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         unique: true,
      },
      thickness: {
         type: Number,
         required: true,
      },
      priceWholesale: {
         type: Number,
         required: true,
      },
      priceRetail: {
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

const ProductDefaultInfo = model("ProductDefaultInfo", productDefaultInfoSchema);

export default ProductDefaultInfo;
