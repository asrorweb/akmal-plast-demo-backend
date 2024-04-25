import jwt from "jsonwebtoken";

const authorizationToken = (req, res, next) => {
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];

   if (!token) {
      return res.status(403).json({ message: "Токен топилмади", messageUz: "Token topilmadi" });
   }

   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
      if (err) {
         return res.status(403).json({ message: "Токен хато", messageUz: "Token xato" });
      }

      req.user = data.user;
      next();
   });
};

export default authorizationToken;
