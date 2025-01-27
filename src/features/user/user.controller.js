import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "./user.model.js";
import userRepository from "./user.repository.js";

export default class  userController{
  constructor(){
    this.UserRepository=new userRepository();
  }
     async signUp(req,res,next){
      try{
        const {name,email,password,type}=req.body;
        const hashedPassword=await bcrypt.hash(password,12);
        const existUser=await this.UserRepository.findByEmail(email);
        if(existUser){
          return res.status(404).send("user exist");
        }
        const user=new userModel(name,email,hashedPassword,type);
        await this.UserRepository.signUp(user);
        return res.status(201).send(user);
      }
      catch(err){
        next(err);
        
      }

     }
     async signIn(req,res,next){
      try{
        const user=await this.UserRepository.findByEmail(req.body.email);
        if(!user){
          return res.status(400).send("Incorrect Credentials");
        }
        else{
          const result= await bcrypt.compare(req.body.password,user.password);
           if(result){
            const token=jwt.sign({userId:user._id,email:user.email},
              process.env.JWT_SECRET,{
                expiresIn:"1h"
              }
            )
           console.log(user._id);
            
            return res.status(200).send(token);
           }
           else{
            return res.status(400).send("Incorrect Credentials");
           }
        }

      }catch(err){
        
        console.log(err);
        return res.status(200).send("something went wrong");
      }

     }
     async resetPassword(req,res){
        const{newPassword}=req.body;
        const userId=req.userId;
        const hashedPassword= await bcrypt.hash(newPassword,12);
      try{
        await this.UserRepository.updatePassword(userId,hashedPassword);
        res.status(200).send("Password is reset");
      }catch(err){
        console.log(err);
        return res.status(500).send("something went worng")
      }
     }
}