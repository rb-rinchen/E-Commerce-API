import express from "express";
import orderController from "./orders.controller.js";

const orderrouter=express.Router();
const OrderController=new orderController();
orderrouter.post("/",(req,res)=>{
    OrderController.placeOrder(req,res);
});

export default orderrouter;