import cloudinary from "cloudinary";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET

//  helper function

export function setSecureCookie(res,token){
    res.cookie('access_token',token,{
        httpOnly: false,              // Prevents JavaScript access (ideal for security)
        secure: false,               // Set to false if testing on http (localhost)
        sameSite: 'lax',             // Use 'lax' for same-site or 'none' for cross-origin
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
    if(!req.cookies.access_token){
        return res.status(403).json({error:"Access denied."})
    }
    try{
        const token = req.cookies.access_token;
        const {userId} = await jwt.verify(token,JWT_SECRET);
        req.userId = userId;
        next();
    }catch(error){
        console.log("Error verifying token",error);
        throw Error("Error verifying token",error)
    }
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



