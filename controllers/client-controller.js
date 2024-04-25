import { removeSpaces } from "../helpers/helpers-funtion.js";
import Client from "../models/regular-client-model.js";

// hamma mijozlarni chaqirish
// get all clients
export const getAllClients = async (req, res, next) => {
   try {
      const clients = await Client.find().sort({ createdAt: "desc" });

      return res.status(200).json(clients);
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

export const getClientWithId = async (req, res, next) => {
   const { id } = req.params;
   try {
      // Find client by ID in the database
      const client = await Client.findById(id).populate({
         path: "tradeHistory",
         options: { sort: { createdAt: -1 } }, // Sort in descending order
      });

      if (!client) {
         // If client is not found, return a 404 error
         return res.status(404).json({ message: "Клент топилмади", messageUz: "Klent topilmadi" });
      }

      // If client is found, return the client data
      return res.status(200).json({ client });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

// klent qo'shish uchun
// for add client
export const addClient = async (req, res, next) => {
   try {
      const { name, number, address } = req.body;

      // bo'sh emasligini tekshish
      if (!name || !number || !address) {
         return res
            .status(400)
            .json({ message: "Малумотларни тўлиқ киритинг", messageUz: "Malumotlarni to'liq kiriting" });
      }

      // remove spaces
      const phoneWithOutSpaces = removeSpaces(number);

      // Check if the client already exists
      // Mizjoni oldim qo'shilmaganini  tekshirish
      const existingUser = await Client.findOne({ number: phoneWithOutSpaces });

      if (existingUser) {
         return res.status(409).json({
            message: "Бу номерга эга Клент аллақачон мавжуд",
            messageUz: "Bu nomerga ega Klent allaqachon mavjud",
         });
      }

      //create a new worker
      //yangi hodim yaratish
      const newClient = new Client({ ...req.body, number: phoneWithOutSpaces });
      await newClient.save();

      return res
         .status(201)
         .json({ message: "Клент муваффақиятли сақланди", messageUz: "Klent muvaffaqiyatli saqlandi" });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

// update worker
export const updateClient = async (req, res, next) => {
   try {
      const { id } = req.params;
      const { number, name, address } = req.body;

      // remove spaces
      req.body.number = removeSpaces(number);

      // malumotlar to'liqligini tekshirish
      if (!name || !number || !address) {
         return res
            .status(400)
            .json({ message: "Малумотларни тўлиқ киритинг", messageUz: "Malumotlarni to'liq kiriting" });
      }

      // nomerni oldin ro'yhaddan o'tmaganini tekshirish
      // check that the number has not been registered before
      const client = await Client.findOne({ number: req.body.number });

      if (client && client._id.toString() !== id)
         return res.status(400).json({
            message: "Ушбу телефон рақами аллақачон ишлатилмоқда",
            messageUz: "Ushbu telefon raqami allaqachon ishlatilmoqda",
         });

      // Find client by ID in the database
      const updatedClient = await Client.findByIdAndUpdate(id, req.body, { new: true });

      if (!updatedClient) {
         // If worker is not found, return a 404 error
         return res.status(404).json({ message: "Клент топилмади", messageUz: "Klent topilmadi" });
      }

      // If worker is found and updated successfully, return the updated worker data
      return res
         .status(200)
         .json({ message: "Клент муаффақиятли янгиланди", messageUz: "Klent muaffaqiyatli yangilandi" });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

export const searchClient = async (req, res, next) => {
   try {
      const { name } = req.query;

      console.log("name=", name);

      let regexPattern = name
         .split("")
         .map((char) => `(?=.*${char})`)
         .join("");
      regexPattern = new RegExp(regexPattern, "i");

      const client = await Client.find({ name: { $regex: regexPattern } });

      res.status(200).json(client);
   } catch (error) {
      console.log("working... err");
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

// delete client with id
export const deleteClient = async (req, res, next) => {
   const { id } = req.params;

   try {
      const deletedKlent = await Client.findByIdAndDelete(id);

      if (!deletedKlent) return res.status(404).json({ message: "Клент топилмади", messageUz: "Klent topilmadi" });

      return res.status(200).json({ message: "Клент ўчирилди", messageUz: "Klent o'chirildi" });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};
