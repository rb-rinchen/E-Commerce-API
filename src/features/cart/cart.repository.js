
import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../error-handler/applicationError.js";
import { ObjectId, ReturnDocument } from "mongodb";

export default class CartRepository{
    constructor(){
        this.collection="cartItems"
    }
    async add(productId, userId, quantity) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const id=await this.getNextCounter(db);
            await collection.updateOne(
                { productId: new ObjectId(productId), userId: new ObjectId(userId) },
                {  $setOnInsert:{_id:id},
                    $inc: {
                        quantity: quantity
                    }
                },
                { upsert: true }
            );
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong in database", 500);
        }
    }
    
    async get(userId){
        try{
           const db=getDB();
           const collection=db.collection(this.collection); 
           return await collection.find({userId:new ObjectId(userId)}).toArray();
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in database",500);
    }
    }
    async delete(cartId,userId){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            const result=await collection.deleteOne({_id:new ObjectId(cartId),userId:new ObjectId(userId)});
            return result.deletedCount>0;
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in database",500);
        }
      
    }
    async getNextCounter(db){
        try{
            const resultDocument=await db.collection("counters").findOneAndUpdate({_id:"cartItemId"},
                {$inc:{value:1}},
                 {returnDocument:ReturnDocument.AFTER}
            );
            console.log(resultDocument.value);
            return resultDocument.value;


        }
        catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in database",500);
        }
    }
}