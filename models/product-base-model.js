import { Schema, model } from "mongoose";

const productBaseSchema = new Schema(
   {
      productType: {
         type: Schema.Types.ObjectId,
         ref: "ProductDefaultInfo",
         required: true,
      },
      meters: {
         type: Number,
         default: 0,
      },
   },
   {
      timestamps: true,
   }
);

const ProductBaseModel = model("ProductBaseModel", productBaseSchema);
export default ProductBaseModel;
