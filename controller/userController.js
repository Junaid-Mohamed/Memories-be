import User from "../db/models/models.user.js";

export const getUser = async(req,res)=>{
    const userId = req.userId;
    try{
        const user = await User.findOne({userId});
        if(!user){
            return res.status(404).json({error:'User not found'})
        }
        res.status(200).json(user._id);
    }catch(error){
        res.status(500).json({error:'Could not authenticate to provide user details.'})
    }
}

export const getAllUsers = async(req,res)=>{
    const userId = req.userId;
    try {
        const allUsers = await User.find({userId: {$ne: userId}});
        if(!allUsers){
            return res.status(400).json({message:'No users found.'});
        }
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({error:'Error fetching all users, ',error});
    }
}