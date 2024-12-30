import cloudinary from "cloudinary";
import fs from "fs";
import multer from "multer";
import path from "path";
import Album from "../db/models/models.album.js";
import Image from "../db/models/models.image.js";
import User from "../db/models/models.user.js";

export const addImages = async(req,res)=>{
    const {albumId} = req.params;
    const {tags,person,isFavorite,comments} = req.body;
    const userId = req.userId;
    try{
        // 1. ensure the albumId exists and the user has access
        const album = await Album.findById(albumId);
        if(!album){
            return res.status(404).json({error:`Album not found`});
        }
        
        //  get the userId doc and compare it with the userId trying to add album
        const user = await User.findOne({userId}) 
        
        if(album.ownerId.toString() !== user._id.toString()){
            return res.status(403).json({error:`You do not have access this album.`})
        }
        // 2. check if file type is an image. file size limit is 5MB
        // details from multer.
        const file = req.file;
        if(!file){
            return res.status(400).json({error:`No file present to upload`})
        }
        const fileSize = file.size;
        const fileName = file.originalname;

        const uploadResult = await cloudinary.uploader.upload(file.path,{
            folder: `albums`,
            resource_type: 'auto'
        }) 
        const imageUrl = uploadResult.secure_url;
        //  3. save metadata
        album.coverImage=imageUrl;
        await album.save()
        const image = new Image({
            albumId,
            imageUrl,
            name: fileName,
            tags: tags ? tags.split(",") : [],
            person: person || [],
            isFavorite: isFavorite === "true",
            size: fileSize,
            uploadedAt: new Date(),
            comments: comments
        })
        // 4. save the file, using multer for file uploads and cloudinary for image uploads in cloud
        await image.save();
        res.status(201).json({message:"Image uploaded successfully."})
    }catch(error){
        console.log(error);
        res.status(500).json({error:`Error adding image ${error}`})
    }
}

export const getAllImages = async(req,res)=>{
    const {albumId} = req.params;
    try{
        const allImages = await Image.find({albumId})
            .populate({
                path:'albumId', // Path to populate
                select:'name -_id' // Fields to retrieve from Album
            });
        if(allImages.length === 0){
            return res.status(200).json({message:"No Images found, add some."})
        }
        res.status(200).json(allImages);
    }catch(error){
        res.status(500).json({error:`error getting all images`,error})
    }
}

export const updateFavorite = async(req,res)=>{
    const {imageId} = req.params;
    const {favorite} = req.body;
    try{
        const updateImage = await Image.findByIdAndUpdate(imageId,{isFavorite:favorite},{new:true});
        if(!updateImage){
            return res.status(400).json({error:'couldnot update the favorite'})
        }
        return res.status(200).json({message:"image updated successfully."})
    }catch(error){
        console.log(error);
        res.status(500).json({error:`error updating favorite`,error})
    }
}

export const addComments = async(req,res)=>{
    const {imageId} = req.params;
    const {comment} = req.body;
    try{
        const image = await Image.findByIdAndUpdate(imageId,{$push:{comments: comment}},{new:true});
        if(!image){
            return res.status(400).json({error:`couldnot add comments`})
        }
        return res.status(200).json({message:"comments added successfully."})
    }catch(error){
        res.status(500).json({error:'error adding comments',error})
    }
}

export const deleteImage = async(req,res)=>{
    const {imageId} = req.params;
    const {albumId} = req.params;
    try{
        const album = await Album.findById(albumId);
        const deletedImage = await Image.findByIdAndDelete(imageId);
        if(!deletedImage){
            return res.status(400).json({error:'Image couldnot be deleted.'})
        }
        const imagesFromAlbum = await Image.find({albumId});
        if(imagesFromAlbum.length>0){
            album.coverImage=imagesFromAlbum[imagesFromAlbum.length-1].imageUrl;
        }
        else{
            album.coverImage="";
        }
        await album.save();
        res.status(200).json({message:"Image deleted successfully."})
    }catch(error){
        res.status(500).json({error:`Error deleting image`,error})
    }
}

export const getAllFavroite = async(req,res) => {
    const {albumId} = req.params;
    try{
        const favroiteImages = await Image.find({albumId,isFavorite:true})
        .populate({
            path:'albumId', // Path to populate
            select:'name -_id' // Fields to retrieve from Album
        });
        if(!favroiteImages || favroiteImages.length === 0){
            return res.status(200).json({message:"no favroite images found"})
        }
        res.status(200).json(favroiteImages);
    }catch(error){
        res.status(500).json({error:`Error getting favroite images ${error}`})
    }
}

export const getImagesByTags = async(req,res)=>{
    const {albumId} = req.params;
    const {tags} = req.query;
    if(!tags){
        return res.status(400).json({message:"Tags are not provided"})
    }
    try {
        const tagsArray = tags.split(",");
        const images = await Image.find({albumId,tags: {$in:tagsArray}});
        if(images.length === 0){
            return res.status(404).json({message:"No images found with provided tags"});
        }
        res.status(200).json(images)
    } catch (error) {
        res.status(500).json({error:"Error fetching images with tags"})
    }
}