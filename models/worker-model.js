import { Schema, model } from "mongoose";

const workerSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
      },
      password: {
         type: String,
         required: true,
      },
      phone: {
         type: String,
         required: true,
         unique: true,
      },
      isAdmin: {
         type: Boolean,
         required: true,
         default: false,
      },
      powers: {
         home: {
            type: Boolean,
            required: true,
            default: true,
         },
      },
   },
   {
      timestamps: true,
   }
);

const Worker = model("Workers", workerSchema);
export default Worker;
