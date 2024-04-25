const isAdminVerify = (req, res, next) => {
   const { isAdmin } = req.user;
   if (!isAdmin) {
      return res.status(403).json({ message: "Сиз админ эмасиз", messageUz: "Siz admin emasiz" });
   }
   next();
};

export default isAdminVerify;
