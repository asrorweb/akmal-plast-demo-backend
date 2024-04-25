import { Schema, model } from "mongoose";

const clientSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
      },
      number: {
         type: String,
         required: true,
         unique: true,
      },
      address: {
         type: String,
         required: true,
      },
      totalBalance: {
         type: Number,
         required: true,
         default: 0,
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

const Client = model("Client", clientSchema);
export default Client;
