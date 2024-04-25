import { Schema, model } from "mongoose";

const productBaseSchema = new Schema(
   {
      productType: {
         type: Schema.Types.ObjectId,
         ref: "ProductDefaultInfo",
         required: true,
      },
      quantity: [
         {
            meter: {
               type: Number,
               required: true,
            },
            manufactId: {
               type: Schema.Types.ObjectId,
               ref: "ProductManefactureHistory",
               required: true,
            },
         },
      ],
   },
   {
      timestamps: true,
   }
);

const ProductBaseModel = model("ProductBaseModel", productBaseSchema);
export default ProductBaseModel;
