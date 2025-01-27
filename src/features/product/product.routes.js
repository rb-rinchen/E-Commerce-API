import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileUpload.middleware.js";


const router=express.Router();
const productController=new ProductController();

router.get("/",(req,res)=>{
    productController.getAllProduct(req,res);
});
router.post("/",upload.single("imgUrl"),(req,res)=>{
    productController.addProduct(req,res);
});
router.get("/filter",(req,res)=>{
    productController.filterProducts(req,res);
});
router.get("/averagePrice",(req,res)=>{
    productController.averagePrice(req,res);
})
router.get("/averageRate",(req,res)=>{
    productController.averageRating(req,res);
})
router.get("/:id",(req,res)=>{
    productController.getOneProduct(req,res);
});
router.post("/rate",(req,res,next)=>{
    productController.rateProduct(req,res,next);
});


export default router;