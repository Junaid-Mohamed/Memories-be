import express from "express";
import { createAlbum, deleteAlbum, getAllAlbums, shareAlbum, updateAlbum } from "../controller/albumController.js";
import { getAllImages } from "../controller/imageController.js";
import imageRoutes from "./imageRoutes.js";

const router = express.Router();
const app = express();

router.get("/",getAllAlbums);
router.post("/",createAlbum);
router.put("/:albumId",updateAlbum);
router.delete("/:albumId",deleteAlbum);
router.put("/:albumId/share",shareAlbum);

//  nested routes of images
router.use("/:albumId/images",imageRoutes)

export default router;