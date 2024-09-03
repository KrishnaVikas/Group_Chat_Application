import express from "express";
import authorization from "../middleware/authMiddleware.js";
import Group from "../models/Group.js";
const router = express.Router();

//Create a group
router.post("/create", authorization, async(req,res)=>{
    try{
        const { name } = req.body;
        let group = await Group.findOne({name});
        if(group){
            res.status(409).json({message: "Group already exists"});
        }
        group = new Group({name});
        await group.save();
        res.status(201).json(group);
    }catch(err){
        res.status(500).json({message: "Internal Server Error"});
    }
});


//get all groups
router.get("/", authorization, async(req,res) => {
    try{
    const groups = await Group.find().populate('members');
    res.status(200).json(groups);
    }catch(err){
        res.status(500).json({message: "Internal Server Error"});
    }
});

//Delete a group
router.delete("/delete/:id", authorization, async(req,res) =>{
    try{
        const groupId = req.params.id;
        await Group.findByIdAndDelete(groupId);
        res.status(200).json({message: "Group deleted"});
    }catch(err){
        res.status(500).json({message: "Internal Server Error"})
    }
});

//Add member to group
router.post("/:id/add-member", authorization, async(req,res)=>{
    try{

        const groupId = req.params.id;
        const userId = req.body.userId;
        const group = await Group.findById(groupId);
        if(!group.members.includes(userId)){
            group.members.push(userId);
            await group.save();
        }else{
            return res.status(409).json({message: "User already exists in the group"})
        }
        res.status(200).json({message: "User added to group"});
    }catch(err){
        res.status(500).json({message: "Internal Server Error"});
    }
});

//Remove a member from group
router.delete('/:groupId/remove-member/:userId', authorization, async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (!group.members.includes(userId)) {
            return res.status(404).json({ message: 'User not in group' });
        }
        group.members = group.members.filter(member => member.toString() !== userId);
        await group.save();
        res.status(200).json({ message: 'User removed from group' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({message: 'Server error'});
    }
});

//searching a group
router.get("/search/:name", authorization, async(req,res)=>{
    try{
        const groups = await Group.find({name: new RegExp(req.params.name, 'i')});
        res.status(200).json(groups);
    }catch(err){
        res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;