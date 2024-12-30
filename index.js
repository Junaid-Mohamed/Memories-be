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

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());


initializeDB();
app.get("/",(req,res)=>{
    res.send("Hi world")
})

app.use('/api/auth', authRoutes)
app.use('/api/albums',verifyToken ,albumRoutes)
app.use('/api/users',verifyToken ,userRoutes)

app.listen(3000,console.log("App listening on port 3000"))