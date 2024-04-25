import jwt from "jsonwebtoken";

const generateJWT = (user) => {
   return jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

export default generateJWT;
