import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../../config/mongodb.js";
import orderModel from "./orders.model.js";
import { ApplicationError } from "../error-handler/applicationError.js";

export default class orderRepository{
    constructor(){
        this.collection="orders"
    }
    async order(userId){
      const client=getClient();
      const session=client.startSession();
    
      try{
        const db=getDB();
        //get the total amount
        session.startTransaction();
        const items= await this.getTotalAmount(userId,session);
        const finalTotalAmount=items.reduce((acc,item)=>acc+item.totalAmount,0)
        //create a instance of the order
       const newOrder=new orderModel(userId,finalTotalAmount,new Date());
        await db.collection("orders").insertOne(newOrder,{session});
        //reduce the stock
        for(let item of items){
            await db.collection("products").updateOne({_id:item.productId},
        {$inc:{stock:-item.quantity}},{session})
        };
        //delete the orders
        await db.collection(this.collection).deleteMany({userId:new ObjectId(userId)},{session});
        await session.commitTransaction();
        session.endSession();
        return;
      }
      catch(err){
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        throw new ApplicationError("something wrong in the database",500);
      }
    }
    async getTotalAmount(userId,session){
      const db=getDB();
      const result=await db.collection("cartItems").aggregate([{
        $match:{userId:new ObjectId(userId)}
      },{$lookup:{
        from:"products",
        localField:"productId",
        foreignField:"_id",
        as:"productInfo"
      }},{$unwind:"$productInfo"},{$addFields:{
        totalAmount:{
            $multiply:[{ $toInt: "$productInfo.price" } ,"$quantity"]
        }
      }}],{session}).toArray();
      return result;
    }
}