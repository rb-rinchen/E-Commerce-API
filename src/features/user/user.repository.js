import mongoose from "mongoose";
import {userSchema} from "./user.schema.js";
import { ApplicationError } from "../error-handler/applicationError.js";


const userModel=mongoose.model("users",userSchema);
export default class userRepository{
    async signIn(email,password){
       try{
         return await userModel.findOne({email,password});
       }catch(err){
        console.log(err);
        throw new ApplicationError("soething went wrong with the database",500);
       }
    }
    async signUp(user){
        try{
          const newUser=new userModel(user);
          await newUser.save();
          return newUser;

        }catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
        }

    }
    async findByEmail(email){
        try{
            return await userModel.findOne({email});

        }catch(err){
            console.log(err);
           throw new ApplicationError("soething went wrong with the database",500);
        }
    }
    async updatePassword(userId,newPassword){
        try{
           let user=await userModel.findById(userId);
           if(user){
              user.password=newPassword;
              user.save();
           }
           else{
               throw new Error("user not found");
           }
        }catch{
           console.log(err);
           throw new ApplicationError("Something went wrong in the database",500);
        }
      }
}