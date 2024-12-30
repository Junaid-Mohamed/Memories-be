import Album from "../db/models/models.album.js";
import Image from "../db/models/models.image.js";
import User from "../db/models/models.user.js";

export const createAlbum = async(req,res)=>{
    try{
        const userId = req.userId;
        const {name, description} = req.body;
        //  validation
        if(!name || typeof name !== "string"){
            return res.status(400).json({error:"Album name is required."})
        }
        const owner = await User.findOne({userId})
        const newAlbum = new Album({name,description,ownerId:owner._id,coverImage:""});
        await newAlbum.save();
        res.status(201).json({message:`album created successfully.`})
    }catch(error){
        res.status(500).json({error:`error creating album`,error})
    }
}

export const getAllAlbums = async(req,res)=>{
    try{
        const allAlbums = await Album.find();
        if(allAlbums.length === 0){
            return res.status(200).json({message:"Albums is empty, please create one"})
        }
        res.status(200).json(allAlbums);
    }catch(error){
        res.status(500).json({error:`error getting all albums`,error})
    }
}

export const updateAlbum = async(req,res) => {
    try{
        const userId = req.userId;
        const {description,ownerId} = req.body;
        const albumToUpdate = await Album.findById(req.params.albumId);
        if(!albumToUpdate){
            return res.status(404).json({error:`could not find album to update ${error}`})
        }
        
        if(albumToUpdate.ownerId.toString() !== ownerId.toString()){
            return res.status(403).json({error:`not the owner to update the album.`})
        }
        const updatedAlbum = await Album.findByIdAndUpdate(req.params.albumId,{description:description},{new:true})
        res.status(200).json({message:`album updated successfully.`,updatedAlbum})
    }catch(error){
        res.status(500).json({error:`error updating album`,error})
    }
}

export const shareAlbum = async(req,res)=>{
    const {albumId} = req.params;
    const {emails} = req.body;
    // make sure in the FE you give options to select the emails which is present
    // in system
    if(!emails && emails.length === 0){
        return res.status(400).json({error:`Please provide emails ${error}`})
    }
    try{
        //  ensure users with the given email id's exists in the system.
        const users = await User.find({email: {$in: emails}})
        if(!users){
            return res.status(404).json({error: `No Users found to add.`})
        }
        const existingUsers = users.map(user=>user._id);
        const album = await Album.findById(albumId);
        if(!album){
            return res.status(404).json({error: `Album not found.`})
        }
        //  avoid adding duplicate emails to sharedWith array.
        const uniqueUsersToAdd = existingUsers.filter(user=> !album.sharedWith.includes(user));
        album.sharedWith.push(...uniqueUsersToAdd);
        await album.save();
        res.status(200).json({message:"Album shared successfully."})
    }catch(error){
        res.status(500).json({error:`error adding share users list to album`,error})
    }
}

export const deleteAlbum = async(req,res)=>{
    const {albumId} = req.params;
    const userId = req.userId;
    const {ownerId} = req.query;
    try{
        //  fetch the album
        const album = await Album.findById(albumId);
        if(!album){
            return res.status(404).json({error:`Album not found, ${error}`})
        }
        //  verify ownership
        if(album.ownerId.toString() !== ownerId.toString()){
            return res.status(403).json({error:`Your not authorized to delete this album`})
        }

        //  delete associated images
        await Image.deleteMany({albumId: album._id})

        //  delete the album
        await Album.findByIdAndDelete(albumId);
        res.status(200).json({message:`Album and associated images deleted successfully.`})
    }catch(error){
        console.log("Error deleting album: ",error);
        res.status(500).json({error:"An error occured while deleting the album."})
    }
}