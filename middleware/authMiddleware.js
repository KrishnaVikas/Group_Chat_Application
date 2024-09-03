import jwt from 'jsonwebtoken';
import config from "../config/config.js";

const authorization = async(req,res,next) => {
  try{
    const token = req.header("x-auth-token");
    if(!token){
      return res.status(401).json({message: "Authorization Denied"});
    }
    const tokenVerification = jwt.verify(token, config.JWT_SECRET);
    req.user = tokenVerification.user;
    next();
  }catch(err){
    res.status(401).json({message: "Token Invalid"});
  }
};

export default authorization;