import mongoose, { Schema }  from "mongoose";

export const cartSchema=new Schema({
    productID:{type:mongoose.Schema.Types.ObjectId,ref:"products"},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    quantity:Number
})