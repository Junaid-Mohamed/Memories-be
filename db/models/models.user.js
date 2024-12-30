import mongoose, { mongo } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: uuidv4,
        unique:true
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    name:{
        type:String,
        required: true,
    },
        googleId: {
            type: String, required: true
        }
},
    {timestamps:true}
)

const User = mongoose.model('User',userSchema);

export default User;
