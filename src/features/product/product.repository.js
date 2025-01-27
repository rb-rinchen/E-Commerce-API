import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../error-handler/applicationError.js";
import { productSchema } from "./products.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./categories.schema.js";

const productModel=mongoose.model("product",productSchema);
const reviewModel=mongoose.model("reviews",reviewSchema);
const categoryModel=mongoose.model("categories",categorySchema)
export default class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(product) {
    try {
        // Ensure category is an array of ObjectIds
        product.category=product.category.split(",").map(e=>e.trim());

        const newProduct = new productModel(product);
        const saveProduct = await newProduct.save();

        await categoryModel.updateMany(
            {
                _id: { $in: product.category }
            },
            {
                $push: {
                    product:new ObjectId(saveProduct._id)
                }
            }
        );
        
        return saveProduct;  // Return the saved product
    } catch (err) {
        console.log(err);
        throw new ApplicationError("Something wrong with the database", 500);
    }
}
  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find().toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong with the database", 500);
    }

  }
  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const product = await collection.findOne({ _id: new ObjectId(id) });
      if (!product) {
        throw new ApplicationError("product not found", 404);
      }
      return product;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong with the database", 500);
    }

  }
  async filter(minPrice, category) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: minPrice };
      }

      if (category) {
        filterExpression = { $or: [{ category: category }, filterExpression] };
      }
      return await collection.find(filterExpression).project({ _id: 0, name: 1, price: 1 }).toArray();

    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong with the database", 500);
    }
  }
  //   async rate(userId, productId, rating) {
  //     try {
  //         const db = getDB();
  //         const collection = db.collection(this.collection);
  //         const product = await collection.findOne({ _id: new ObjectId(productId) });

  //         // Check if the product exists
  //         if (!product) { // Check if product is null or undefined
  //             throw new ApplicationError("Product not found", 404);
  //         }

  //         // Check if the rating array exists
  //         if (!product.rating) {
  //             // Insert the rating inside it
  //             await collection.updateOne(
  //                 { _id: new ObjectId(productId) },
  //                 { $set: { rating: [{ userId: new ObjectId(userId), rating }] } } // Initialize rating array
  //             );
  //         } else {
  //             // Check if the user rating exists
  //             const existingUserRating = product.rating.find(r => r.userId.equals(new ObjectId(userId)));

  //             if (existingUserRating) {
  //                 // Update the existing rating
  //                 await collection.updateOne(
  //                     { _id: new ObjectId(productId), "rating.userId": new ObjectId(userId) },
  //                     { $set: { "rating.$.rating": rating } } // Update the specific user's rating
  //                 );
  //             } else {
  //                 // If the user rating does not exist, push a new rating
  //                 await collection.updateOne(
  //                     { _id: new ObjectId(productId) },
  //                     { $push: { rating: { userId: new ObjectId(userId), rating } } } // Add new rating
  //                 );
  //             }
  //         }

  //     } catch (err) {
  //         console.log(err);
  //         throw new ApplicationError("Something went wrong with the database", 500);
  //     }
  // }
  // async rate(userId, productId, rating) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     await collection.updateOne({ _id: new ObjectId(productId) }, {
  //       $pull: { rating: { userId: new ObjectId(userId) } }
  //     });
  //     await collection.updateOne({ _id: new ObjectId(productId) },
  //       { $push: { rating: { userId: new ObjectId(userId), rating: rating } } }
  //     )
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("something wrong in the database", 500);
  //   }
  // }
  async rate(userId, productId, rating) {
    try {
       const product=await productModel.findById(productId);
       if(!product){
        throw new Error("product not found");
       }
       const userRating=await reviewModel.findOne({user:new ObjectId(userId),product:new ObjectId(productId)});
       if(userRating){
        userRating.rating=rating;
        await userRating.save();
       }
       else{
        const newRating=new reviewModel({user:new ObjectId(userId),product:new ObjectId(productId),rating:rating});
        await newRating.save();
       }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something wrong in the database", 500);
    }
  }

  async averagePricePerCategory() {
    try {
      const db = getDB();

      return await db.collection(this.collection).aggregate([
        {
          $group: {
            _id: "$category", // Group by the category field
            averagePrice: { $avg: {$toDouble:"$price"} } // Calculate average price
          }
        }
      ]).toArray();

    } catch (err) {
      console.log(err);
      throw new ApplicationError("something wrong in the database", 500);
    }

  }
  async averageRatingPerProducut(){
    try{
      const db=getDB();
      return await db.collection(this.collection).aggregate([{
        $unwind:"$rating"
      },{
        $group:{
          _id:"$name",
          averageRating:{$avg:"$rating.rating"}
        }
      }]).toArray();
    }catch(err){
      console.log(err);
      throw new ApplicationError("something wrong in the database", 500);
    }
  }

}