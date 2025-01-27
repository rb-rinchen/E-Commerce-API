import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../error-handler/applicationError.js";
import userModel from "./user.model.js";

 export default class userRepository{
    constructor(){
        this.collection="users"
    }
    async signUp(newUser){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
           await collection.insertOne(newUser);
           return newUser;
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
    
        }
           
       }
       async findByEmail(email){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            return await collection.findOne({ email: email });
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database",500);
    

        }
       }
       async checkUser(email,password){
        try{
          const db=getDB();
          const collection=db.collection(this.collection);
          return await collection.findOne({email,password});
        }catch(err){
           console.log(err);
           throw new ApplicationError("Something went wrong in the database",500);
        }
       }
       
 }
