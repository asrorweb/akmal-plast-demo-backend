import ProductBaseModel from "../models/product-base-model.js";
import ProductManefactureHistory from "../models/product-manufactured-history-model.js";

export const getALlProductFromBase = async (req, res, next) => {
   try {
      const productsFromBase = await ProductBaseModel.find().populate("productType");

      return res.status(200).json(productsFromBase);
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

export const getOneProductFromBaseById = async (req, res, next) => {
   try {
      const { id } = req.params;
      const product = await ProductBaseModel.findById(id).populate("productType");

      if (!product) {
         return res.status(404).json({ message: "Маҳсулот топилмади", messageUz: "Mahsulot topilmadi" });
      }

      return res.status(200).json(product);
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

export const searchProductFromBase = async (req, res, next) => {
   try {
      const { name } = req.query;

      let regexPattern = name
         .split("")
         .map((char) => `(?=.*${char})`)
         .join("");
      regexPattern = new RegExp(regexPattern, "i");

      const product = await ProductBaseModel.find().populate({
         path: "productType",
         match: { name: { $regex: regexPattern } },
      });

      // Faqat topilgan ma'lumotlarni olish
      const filteredProduct = product.filter((item) => item.productType);

      res.status(200).json(filteredProduct);
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

export const getAllProductManufacturedHistory = async (req, res, next) => {
   try {
      // Sahifalash uchun kerakli parametrlarni olish
      const page = parseInt(req.query.page) || 1; // Hozirgi sahifa (agar query parametri berilmasa 1-sahifa)
      const limit = parseInt(req.query.limit) || 5; // Har bir sahifadagi elementlar soni (agar query parametri berilmasa 10 ta element)

      // Boshlang'ich vaqt limitini hisoblash
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const productManufactured = await ProductManefactureHistory.find()
         .sort({ createdAt: "desc" })
         .populate([
            { path: "name" },
            { path: "author", select: "-password -powers" }, // "select" bo'limini to'g'riladim
         ])
         .skip(startIndex) // Boshlanish indeksi
         .limit(limit); // Chegara

      // Keyingi sahifani tekshirish
      const total = await ProductManefactureHistory.countDocuments();
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = endIndex < total;
      const hasPrevPage = startIndex > 0;

      // Pagination ma'lumotlarni o'z ichiga oluvchi obyekt
      const pagination = {
         totalPages,
         currentPage: page,
         hasNextPage,
         hasPrevPage,
         totalEntries: total,
         entriesPerPage: productManufactured.length,
      };

      // Natijani qaytarish
      return res.status(200).json({ productManufactured, pagination });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

export const addProductManufacturedHistoryAndBase = async (req, res, next) => {
   const { id } = req.params;
   const { meter } = req.body;
   const { _id } = req.user;

   try {
      if (!id || !meter)
         return res
            .status(404)
            .json({ message: "Маълумотларни тўлиқ киритинг", messageUz: "Ma'lumotlarni to'liq kiriting" });

      //Create product manufacturing history
      const manufacturingHistory = new ProductManefactureHistory({
         name: id, // Assuming 'id' corresponds to the product name
         meter,
         author: _id,
      });
      await manufacturingHistory.save();

      // Update product base model
      await ProductBaseModel.findOneAndUpdate(
         { productType: id },
         { $push: { quantity: { meter: meter, manufactId: manufacturingHistory._id } } },
         { upsert: true }
      );

      res.status(201).json({ message: "Махсулот қўшилди", messageUz: "Maxsulot qo‘shildi" });
   } catch (error) {}
};

// for delete
export const deleteProductManufacturedHistoryAndBase = async (req, res, next) => {
   try {
      const { id } = req.params;

      // Ma'lumotlar bazasidagi ma'lumotni yaratilish vaqtini tekshirish
      const productHistory = await ProductManefactureHistory.findById(id);
      if (!productHistory) {
         return res.status(404).json({ message: "Ma'lumot topilmadi", messageUz: "Ma'lumot topilmadi" });
      }

      const creationDate = productHistory.createdAt;
      const currentDate = new Date();
      const differenceInTime = currentDate.getTime() - creationDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24); // milliseconds to days

      if (differenceInDays >= 1) {
         // Agar ma'lumot yaratilish vaqti hozirgi vaqtga nisbatan bir kun va undan ko'p bo'lsa, o'chirishni to'xtatish
         return res.status(400).json({
            message: "Маълумот яратилганига 1 кун дан ошди",
            messageUz: "Ma'lumot yaratilganiga 1 kun dan oshdi",
         });
      }

      // ProductManefactureHistory koleksiyasidan berilgan "id" bilan yozuvni o'chirish
      const deletedHistory = await ProductManefactureHistory.findByIdAndDelete(id);

      // ProductBaseModel koleksiyasidan "id" ni o'z ichiga olgan productni topish
      const product = await ProductBaseModel.findOneAndUpdate(
         { "quantity.manufactId": id }, // "quantity" massivida "manufactId" ni qidirish
         { $pull: { quantity: { manufactId: id } } }, // "quantity" massividan berilgan "manufactId" ni o'chirish
         { new: true } // Yangi yangilanayotgan malumotni qaytarish
      );
      console.log("deleteHistory", deletedHistory);
      console.log("product", product);

      if (!deletedHistory || !product) {
         // Agar o'chirish muvaffaqiyatli bo'lmagan bo'lsa 404 Not Found xatosi qaytariladi
         return res.status(404).json({ message: "Mavjud emas", messageUz: "Mavjud emas" });
      }

      res.status(200).json({ message: "Махсулот ўчирилди", messageUz: "Maxsulot o'chirildi" });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};
