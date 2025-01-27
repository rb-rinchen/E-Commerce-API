import express from "express"
import likeController from "./like.controller.js";

const likeRouter=express.Router();
const LikeController=new likeController();

likeRouter.post("/",(req,res)=>{
    LikeController.like(req,res);
});
likeRouter.get("/",(req,res)=>{
    LikeController.getLikes(req,res);
})
export default likeRouter;