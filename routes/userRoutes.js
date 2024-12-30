import express from "express";
import { getAllUsers, getUser } from "../controller/userController.js";

const router = express.Router(); // Merge params from parent router

router.get("/",getUser);
router.get("/all-users",getAllUsers);

export default router;