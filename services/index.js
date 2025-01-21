import cloudinary from "cloudinary";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET

//  helper function

export function setSecureCookie(res,token){
    console.log('Token recieved inside setCookie ',token)
    res.cookie('access_token',token,
        {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
    })
    return res;
}

export async function createToken(userId){
    try{
        const token = await jwt.sign({userId},JWT_SECRET)
    return token
    }catch(error){
        console.log("Error while creating token",error);
        throw Error("Error while creating token",error)
    }
}

export async function verifyToken(req,res,next){
    console.log("inside verify token",req.cookies.access_token);
    if(!req.cookies.access_token){
        return res.status(403).json({error:"Access denied."})
    }
    next()
    // try{
    //     const token = req.cookies.access_token;
    //     const {userId} = await jwt.verify(token,JWT_SECRET);
    //     req.userId = userId;
    //     next();
    // }catch(error){
    //     console.log("Error verifying token",error);
    //     throw Error("Error verifying token",error)
    // }
}

//  get current date helper function

function getCurrentDate () {
    return `${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}` 
}

//  cloudinary and multer helper functions.

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

const storage = multer.diskStorage({
    filename: function(req,file,cb){
        cb(null, `${getCurrentDate()}-${file.originalname}`)
    }
})
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/; // Allowed extensions
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
    fileFilter,
});



