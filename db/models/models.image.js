import mongoose, { mongo, now } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const imageSchema = new mongoose.Schema({
    imageId: {
        type: String,
        default: uuidv4,
        unique:true
    },
    imageUrl: {
        type: String,
        required: true
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
        required: true        
    },
    name:{
        type:String,
        required: true,
    },
    tags: {
        type: [String],
        default:[]
    },
    person: {
        type: [String], // email id's that can have access to the album
        default:[]
    },
    isFavorite: {
        type: Boolean,
        default:false
    },
    comments: {
        type: [String],
        default: []
    },
    size:{
        type: Number,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
},
    {timestamps:true}
)

const Image = mongoose.model('Image',imageSchema);

export default Image;
