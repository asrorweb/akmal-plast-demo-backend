import generateJWT from "../config/generateJWT.js";
import { removeSpaces } from "../helpers/helpers-funtion.js";
import Worker from "../models/worker-model.js";
import bcrypt from "bcrypt";

// hamma hodimlarni chaqirish // get all workers
export const getAllWorker = async (req, res, next) => {
   try {
      // hamma hodimlarni topish
      // find all workers
      const workers = await Worker.find().select("-password");

      if (!workers) return res.status(404).json({ message: "Ходим топилмади", messageUz: "Xodim topilmadi" });

      return res.status(200).json(workers);
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

export const getWorkerWithId = async (req, res, next) => {
   const { id } = req.params;
   try {
      // Find worker by ID in the database
      const worker = await Worker.findById(id).select("-password");

      if (!worker) {
         // If worker is not found, return a 404 error
         return res.status(404).json({ message: "Ходим топилмади", messageUz: "Xodim topilmadi" });
      }

      // If worker is found, return the worker data
      return res.status(200).json({ user: worker });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

// update worker
export const updateWorker = async (req, res, next) => {
   const { id } = req.params;
   const { phone, name, password } = req.body;

   // remove spaces
   req.body.phone = removeSpaces(phone);

   try {
      // agar password bo'lsa uni hashlash
      // hashing the password if it exists
      if (password) req.body.password = await bcrypt.hash(password, 10);
      const updateData = req.body;

      // malumotlar to'liqligini tekshirish
      if (!name || !phone) {
         return res
            .status(400)
            .json({ message: "Малумотларни тўлиқ киритинг", messageUz: "Malumotlarni to'liq kiriting" });
      }

      // nomerni oldin ro'yhaddan o'tmaganini tekshirish
      // check that the number has not been registered before
      const worker = await Worker.findOne({ phone: updateData.phone });

      if (worker && worker._id.toString() !== id)
         return res.status(400).json({
            message: "Ушбу телефон рақами аллақачон ишлатилмоқда",
            messageUz: "Ushbu telefon raqami allaqachon ishlatilmoqda",
         });

      // Find worker by ID in the database
      const updatedWorker = await Worker.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedWorker) {
         // If worker is not found, return a 404 error
         return res.status(404).json({ message: "Xодим топилмади", messageUz: "Xodim topilmadi" });
      }

      // If worker is found and updated successfully, return the updated worker data
      return res
         .status(200)
         .json({ message: "Ходим муаффақиятли янгиланди", messageUz: "Xodim muaffaqiyatli yangilandi" });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

// xodimni malumotlarini olish jwt token bilan
export const getWorker = async (req, res, next) => {
   const { phone } = req.user;

   try {
      // xodimni topish
      const worker = await Worker.findOne({ phone }).select("-password").lean();

      if (!worker) return res.status(404).json({ message: "Xодим топилмади", messageUz: "Xodim topilmadi" });

      const token = generateJWT(worker);

      const user = { ...worker, token };

      return res.status(200).json({ user });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

export const searchWorker = async (req, res, next) => {
   const { name } = req.query;

   try {
      let regexPattern = name
         .split("")
         .map((char) => `(?=.*${char})`)
         .join("");
      regexPattern = new RegExp(regexPattern, "i");

      const workers = await Worker.find({ name: { $regex: regexPattern } });

      res.status(200).json(workers);
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

// register workers
export const registerWorker = async (req, res, next) => {
   const { password, phone, name } = req.body;

   try {
      // bo'sh emasligini tekshish
      if (!name || !phone || !password) {
         return res
            .status(400)
            .json({ message: "Малумотларни тўлиқ киритинг", messageUz: "Malumotlarni to'liq kiriting" });
      }

      // remove spaces
      const phoneWithOutSpaces = removeSpaces(phone);

      // Check if the user already exists
      //   Xodim oldim register qilmaganini tekshirish
      const existingUser = await Worker.findOne({ phone: phoneWithOutSpaces });

      if (existingUser) {
         return res.status(409).json({
            message: "Бу номерга эга фойдаланувчи аллақачон мавжуд",
            messageUz: "Bu nomerga ega foydalanuvchi allaqachon mavjud",
         });
      }

      req.body.password = await bcrypt.hash(password, 10);

      //create a new worker
      //yangi hodim yaratish
      const worker = new Worker({ ...req.body, phone: phoneWithOutSpaces });
      await worker.save();

      return res
         .status(201)
         .json({ message: "Ходим муваффақиятли сақланди", messageUz: "Xodim muvaffaqiyatli saqlandi" });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

// login worker
export const loginWorker = async (req, res, next) => {
   const { phone, password } = req.body;
   console.log("login worker");
   try {
      const phoneWithOutSpaces = removeSpaces(phone);

      // Check if the user already exists
      //   Xodim oldim register qilmaganini tekshirish
      const existingUser = await Worker.findOne({ phone: phoneWithOutSpaces }).lean();

      if (!existingUser) {
         return res.status(404).json({ message: "Ходим топилмади", messageUz: "Xodim topilmadi" });
      }

      // parolni db dagi parol bilan tekshirish
      // checking password with password in db
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
         return res.status(401).json({ message: "Нотўғри парол", messageUz: "Noto‘g‘ri parol" });
      }

      const token = generateJWT(existingUser);
      const user = { ...existingUser, token };

      return res
         .status(200)
         .json({ message: "Тизимга муаффақиятили кириш", messageUz: "Tizimga muaffaqiyatili kirish", user });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

// update worker with id

// delete worker with id
export const deleteWorker = async (req, res, next) => {
   const { id } = req.params;

   try {
      const deletedWorker = await Worker.findByIdAndDelete(id);

      if (!deletedWorker) return res.status(404).json({ message: "Ходим топилмади", messageUz: "Xodim topilmadi" });

      return res.status(200).json({ message: "Ходим ўчирилди", messageUz: "Xodim o'chirildi" });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};
