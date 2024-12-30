import express from "express";
import { addComments, addImages, deleteImage, getAllFavroite, getAllImages, getImagesByTags, updateFavorite } from "../controller/imageController.js";
import { upload } from "../services/index.js";

const router = express.Router({ mergeParams: true }); // Merge params from parent router


router.get("/",getAllImages);
router.get("/tags",getImagesByTags);
router.post("/",upload.single("image"),addImages)
router.put("/:imageId/favorite",updateFavorite)
router.delete("/:imageId",deleteImage);
router.get("/favorites",getAllFavroite)
router.post("/:imageId/comments",addComments)

export default router;