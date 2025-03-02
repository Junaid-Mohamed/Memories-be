import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import initializeDB from "./db/index.js";

//  routes
import albumRoutes from "./routes/albumRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { verifyToken } from "./services/index.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["https://memories-fe-pi.vercel.app","http://localhost:5173"]}));

app.use(cookieParser());


initializeDB();
app.get("/",(req,res)=>{
    res.send("Hi world")
})

app.use('/api/auth',authRoutes)
app.use('/api/albums',verifyToken ,albumRoutes)
app.use('/api/users',verifyToken ,userRoutes)

app.listen(PORT,console.log(`App running on port ${PORT}`))