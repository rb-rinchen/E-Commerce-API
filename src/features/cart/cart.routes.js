import express from "express"
import CartController from "./cart.controller.js";


const cartController=new CartController();


const cartRouter=express.Router();

cartRouter.post("/",(req,res)=>{
    cartController.addItem(req,res);
});
cartRouter.get("/",(req,res)=>{
    cartController.getCart(req,res);
});
cartRouter.put('/update',(req,res)=>{
    cartController.updateCart(req,res);
});
cartRouter.delete("/:id",(req,res)=>{
    cartController.deleteCart(req,res);
})

export default cartRouter;