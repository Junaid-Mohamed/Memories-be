import mongoose, { mongo } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const albumSchema = new mongoose.Schema({
    albumId: {
        type: String,
        default: uuidv4,
        unique:true
    },
    name:{
        type:String,
        required: true,
    },
    coverImage:{
        type:String
    },
    description: {
        type: String,
        default: ""
    },
    sharedWith: {
        type: [mongoose.Schema.Types.ObjectId], // email id's that are tagged in the image if any.
        ref: 'User',
        default:[]
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
},
    {timestamps:true}
)

const Album = mongoose.model('Album',albumSchema);

export default Album;
