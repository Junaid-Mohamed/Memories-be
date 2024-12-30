import express from "express";
import { googleAuthenticate, googleRedirect } from "../controller/authController.js";

const router = express.Router();

router.get("/",(req,res)=>res.send("Auth route"))
router.get("/google",googleAuthenticate);
router.get("/google/callback",googleRedirect)

export default router;