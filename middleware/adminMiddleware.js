import User from "../models/User.js";

const adminAccess = async(req,res,next)=>{
    try{
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        if(user.role !== 'admin'){
            return res.status(403).json({message: "Admin access required"});
        }else{
            next();
        }
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
}

export default adminAccess;