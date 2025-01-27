import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../error-handler/applicationError.js";

export default class userModel{
    constructor(name,email,password,type,id){
       this.name=name;
       this.email=email;
       this.password=password;
       this.type=type;
       this._id=id;
   }
   static async signUp(name,email,password,type){
    try{
        //call the data base
        const db=getDB();
        //collection you want to store the data
        const collection=db.collection("users");
       //fetch the doc and save in collection
       const newUser=new userModel(name,email,password,type);
       await collection.insertOne(newUser);
       return newUser;
    }
    catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong",500);

    }
       
   }
   static signIn(email,password){
       const user=users.find((u)=>u.email==email &&u.password==password);
       return user;

   }
   static getAll(){
    return users;
   }

}
let users=[]