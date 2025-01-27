import mongoose from "mongoose";

export const reviewSchema=new mongoose.Schema(
    {
        user:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
        product:{type:mongoose.Schema.Types.ObjectId,ref:"products"},
        rating:Number
    }
)                                                                       

        