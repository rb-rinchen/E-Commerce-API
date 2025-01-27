import { MongoClient } from "mongodb";

let client;

export const connectMongodb=()=>{
   
   MongoClient.connect(process.env.DB_URL).then(clientInstance=>{
     client=clientInstance;
     console.log("Mongodb is connected");
     createCounter(client.db());
     createIndexes(client.db());
   }).catch(err=>{
      console.log(err);
   })
}

export const getDB=()=>{
    return client.db();
}
const createCounter=async(db)=>{
   try{
      const existCounter=await db.collection("counters").findOne({_id:"cartItemId"});
      if(!existCounter){
         await db.collection("counters").insertOne({_id:"cartItemId",value:0});
         console.log("counter value is created");
      }

   }catch(err){
      console.log(err);
   }
}
const createIndexes=async(db)=>{
   try{
     await db.collection("products").createIndex({price:1});
     await db.collection("products").createIndex({name:1,category:-1});
     await db.collection("products").createIndex({description:"text"});
     console.log("indexes are created");
   }catch(err){
      console.log(err);
   }
   
}
export const getClient=()=>{
   return client;
}


