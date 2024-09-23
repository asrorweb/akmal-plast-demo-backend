import ProductDefaultInfo from "../models/product-default-info-model.js";

export const getAllProductDefaultInfo = async (req, res, next) => {
   try {
      const product = await ProductDefaultInfo.find().sort({ createdAt: "desc" }).populate({
         path: "author",
         select: "-password",
      });
      if (!product) return res.status(404).json({ message: "махсулот топилмади", messageUz: "maxsulot topilmadi" });

      return res.status(200).json(product);
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

// maxsulot qo'shish
// add product
export const createProductDefaultInfo = async (req, res, next) => {
   const { _id } = req.user;
   const { name } = req.body;
   try {
      // Check if a product with the same name and thickness already exists
      const existingProduct = await ProductDefaultInfo.findOne({ name });

      if (existingProduct) {
         return res.status(404).json({ message: "Махсулот мавжуд", messageUz: "Maxsulot mavjud" });
      }

      const newProduct = new ProductDefaultInfo({ ...req.body, author: _id });
      await newProduct.save();

      res.status(200).json({ message: "махсулот муаффақиятли қўшилди", messageUz: "maxsulot muaffaqiyatli qo'shildi" });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

// delete product
// maxsulotni o'chirish

export const deleteProductDefaultInfo = async (req, res, next) => {
   const { id } = req.params;
   try {
      // Maxsulotni o'chirish
      const deletedProduct = await ProductDefaultInfo.findByIdAndDelete(id);

      if (!deletedProduct) {
         return res.status(404).json({ message: "Maxsulot topilmadi", messageUz: "Махсулот топилмади" });
      }

      res.status(200).json({
         message: "Maxsulot muvaffaqiyatli o'chirildi",
         messageUz: "Махсулот муваффақиятли ўчирилди",
      });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

export const searchProductDefaultInfo = async (req, res, next) => {
   const { name } = req.query;

   try {
      let regexPattern = name
         .split("")
         .map((char) => `(?=.*${char})`)
         .join("");
      regexPattern = new RegExp(regexPattern, "i");

      const product = await ProductDefaultInfo.find({ name: { $regex: regexPattern } });

      res.status(200).json(product);
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

export const getByIdProductDefaultInfo = async (req, res, next) => {
   const { id } = req.params;
   try {
      const product = await ProductDefaultInfo.findById(id);

      if (!product) return res.status(404).json({ message: "Махсулот топилмади", messageUz: "Махсулот топилмади" });

      return res.status(200).json({ product });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};

export const updateProductDefaultInfo = async (req, res, next) => {
   const { name } = req.body;
   const { id } = req.params;
   const { _id } = req.user;

   try {
      // Maxsulotni tekshirish
      const existingProduct = await ProductDefaultInfo.findOne({ name });

      if (existingProduct && existingProduct._id.toString() !== id) {
         return res.status(400).json({ message: "Maxsulot nomi mavjud", messageUz: "Махсулот номи мавжуд" });
      }

      const updatedProduct = await ProductDefaultInfo.findByIdAndUpdate(
         id,
         { ...req.body, author: _id },
         { new: true }
      );

      if (!updatedProduct) {
         return res.status(404).json({ message: "Maxsulot topilmadi", messageUz: "Махсулот топилмади" });
      }

      res.status(200).json({
         message: "Maxsulot muvaffaqiyatli yangilandi",
         messageUz: "Махсулот муваффақиятли янгиланди",
      });
   } catch (error) {
      next(error);
      // ish ErrorHandlerGlobal.js da davom etyapti
      // work in progress at ErrorHandlerGlobal.js
   }
};
