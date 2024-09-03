import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/config.js";
import User from "../models/User.js";
import adminAccess from "../middleware/adminMiddleware.js";
import authorization from "../middleware/authMiddleware.js";

const router = express.Router();

const saltRounds = config.saltRounds;
const secretKey = config.JWT_SECRET;

//Register
router.post("/register", authorization, adminAccess, async(req,res)=>{
    try{
        const {username, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        
        const isUserExist = await User.findOne({username});
        if(isUserExist){
            return res.status(400).json({message: 'User already exists'});
        }
        
        const user = new User({username,password: hashedPassword, role});
        await user.save().then((resp)=>{
            res.status(201).json({message: "User registered successfully", user});
        }).catch((err)=>{
            console.log("Error while saving user data: ", err);
            res.status(500).json({message: err.message});
        });

    }catch(err){
        res.status(500).json({message: err.message});
    }
});

//Login
router.post("/login", async(req,res)=>{
    try{
        const {username, password} = req.body;
        if(!username){
            return res.status(400).json({message: "Please provide username"});
        }
        if(!password){
            return res.status(400).json({message: "Please provide password"});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({message: "Invalid Credentials"});
        }
        
        const token = jwt.sign({user: {id: user._id}}, secretKey, {expiresIn: "1h"});
        res.json({token});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

//Logout
router.post("/logout", authorization, (req,res)=>{
    res.status(200).json({message: "Logged out"});
});

//Edit User
router.put("/users/:userId", authorization, adminAccess, async(req,res)=>{
    try{
        const {username, role} = req.body;
        const userId = req.params.userId;
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        if (username) user.username = username;
        if (role) user.role = role;
        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

//get all users
router.get("/users", authorization, async(req,res) => {
    try{
    const users = await User.find();
    res.status(200).json(users);
    }catch(err){
        res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;