import express from "express";
import userController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";


const UserRouter=express.Router();
const UserController=new userController()


UserRouter.post('/signUp',(req,res,next)=>{
    UserController.signUp(req,res,next);
});
UserRouter.post("/signIn",(req,res,next)=>{
    UserController.signIn(req,res,next);
});
UserRouter.put("/resetPassword",jwtAuth,(req,res)=>{
    UserController.resetPassword(req,res)
})



export default UserRouter;