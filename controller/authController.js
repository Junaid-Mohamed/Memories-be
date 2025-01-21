import axios from "axios";
import dotenv from "dotenv";
import User from "../db/models/models.user.js";
import { createToken, setSecureCookie } from "../services/index.js";
dotenv.config();

export const googleAuthenticate = (req,res) => {
    try{

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=https://memories-be-xi.vercel.app/api/auth/google/callback&response_type=code&scope=profile email`
        res.redirect(googleAuthUrl);
    }catch(error){
        res.status(500).json({error:'authentication failed.',error})
    }
}

export const googleRedirect = async(req,res) => {
    const {code} = req.query;
    console.log("Inside redirect URL")
    if(!code){
        return res.status(400).send('Authorization code not provided.')
       } 
       let access_token;
    try{
    const tokenResponse = await axios.post(`https://oauth2.googleapis.com/token`,
        {
            client_id:process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `https://memories-be-xi.vercel.app/api/auth/google/callback`
        },
        {
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    },
    )
    access_token = tokenResponse.data.access_token;
    // const googleUserDataResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', 
    //     {
    //         headers: {
    //             Authorization: `Bearer ${access_token}`
    //         }
    //     }
    // )
    
    // const {id,email,name} = googleUserDataResponse.data;
    // const token = await createUser(id,email,name);
    setSecureCookie(res,access_token);
    // res.json({user:googleUserDataResponse.data});
    // res.send("Success")
    // console.log(res.getHeaders())
    return res.redirect(`https://memories-fe-pi.vercel.app`)
    }catch(error){
        console.error(error);
        res.status(500).json({error})
    }
}

//  util function

async function createUser(id,email,name){
    try{
        let user = await User.findOne({email})
        //  create user if not exists
        if(!user){
            user = new User({email,googleId:id,name})
            await user.save();
        }
        //  create a token and return
        const token = await createToken(user.userId);
        return token;
    }catch(error){
        console.log("Error saving user to db");
        throw Error("Error saving user to db")
    }
}



