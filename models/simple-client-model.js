import { Schema, model } from "mongoose";

const simpleClientSchema = new Schema(
   {
      name: {
         type: String,
         default: "Mijoz",
      },
      number: {
         type: String,
         default: "+998",
      },
      tradeHistory: [
         {
            type: Schema.Types.ObjectId,
            ref: "ProductTradeHistory",
            default: "",
         },
      ],
   },
   {
      timestamps: true,
   }
);

const SimpleClient = model("SimpleClient", simpleClientSchema);
export default SimpleClient;
