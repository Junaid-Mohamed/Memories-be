import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const initializeDB = async() => {
    try{
        await mongoose.connect(MONGO_URL,{useNewUrlParser: true,
            useUnifiedTopology: true,})
        console.log("Connection to db successfull.")
    }catch(error){
        console.log("Error connecting to db",error)
    }
}

export default initializeDB;