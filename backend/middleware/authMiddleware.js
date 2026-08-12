import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
   try {
     const authHeader = req.headers.authorization;
     if (!authHeader || !authHeader.startsWith("Bearer ")) {
         return res.status(401).json({ message: "Not authorized, no token" });
     }
     
     const token = authHeader.substring(7); // Remove "Bearer " from the header
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
     const user = await User.findById(decoded.id).select("-password");
     if (!user) {
         return res.status(404).json({
              message: "Not authorized, user not found" 
         });
     }

     req.user = user;
     next();
   } catch (error) {  
     res.status(401).json({ message: "Not authorized, token failed" });
   } 
};

export default authMiddleware;