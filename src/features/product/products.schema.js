import mongoose  from "mongoose";

export const productSchema=new mongoose.Schema({
    name:String,
    description:String,
    price:Number,
    stock:Number,
    reviews:[{type:mongoose.Schema.Types.ObjectId,ref:"reviews"}],
    category:[{type:mongoose.Schema.Types.ObjectId,ref:"categories"}]
})