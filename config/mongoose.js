import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../src/features/product/categories.schema.js";
dotenv.config();

let url=process.env.DB_URL;
export async function connectUsingMongoose(){
    try{
        await mongoose.connect(url);
        console.log("Mongodb is connected using mongoose");
        addCategories();

    }catch(err){
      console.log("There is some error in connecting with mongodb", err);
    }
}
async function addCategories() {
  const categoryModel=mongoose.model("category",categorySchema)
   const category=await categoryModel.find();
   if(!category || category.length==0){
    await categoryModel.insertMany([{name:"Electronics"},{name:"books"},{name:"Tech"}]);
   }
   console.log("categories is created")
}