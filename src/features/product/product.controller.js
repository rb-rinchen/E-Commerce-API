
import mongoose from "mongoose";
import { ApplicationError } from "../error-handler/applicationError.js";
import productModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
export default class productController{
    constructor(){
        this.productRepository=new ProductRepository(); 
    }
    async getAllProduct(req,res){
        try{
          const products=await this.productRepository.getAll();
          return res.status(200).send(products); 

        }catch(err){
          console.log(err);
          res.status(200).send("something went wrong");  
        }  
    }
   
    async addProduct(req, res) {
        try {
            const { name, price, sizes, description, category } = req.body;
            
            const sizeArray = sizes ? sizes.split(',') : [];
             const newProduct=new productModel(name,description,req.file.fileName,category,price,sizeArray);
          
            const createdRecord = await this.productRepository.add(newProduct);
            res.status(201).send(createdRecord);
        } catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
    }
    
    async getOneProduct(req,res){
        try{
          const id=req.params.id;
          
          const product=await this.productRepository.get(id);
          console.log(product);
          return res.status(200).send(product);
      }catch(err){
          console.log(err);
          return res.status(200).send("something went wrong");
        }
        
    }
   async filterProducts(req,res){
    try{
        const minPrice=req.query.minPrice;
        const category=req.query.category;
        const result= await this.productRepository.filter(minPrice,category);
        res.status(200).send(result);

    } 
    catch(err){
        console.log(err);
        return res.status(200).send("something went wrong");
      }
    }
    async rateProduct(req,res,next){ 
        try{
            const userId=req.userId;
           const productId=req.body.productId;
           const rating=req.body.rating;
           await this.productRepository.rate(userId,productId,rating);
           return res.status(200).send("rating has been added successfully");
        }catch(err){
            console.log(err);
          next(err);
        }
    }
    async averagePrice(req,res){
        try{
          const price=await this.productRepository.averagePricePerCategory();
          res.status(200).send(price);
        }
        catch(err){
            console.log(err);
            return res.status(500).send("something went wrong");
        }
    }
    async averageRating(req,res){
        try{
            const average=await this.productRepository.averageRatingPerProducut();
            res.status(200).send(average);

        }catch(err){
            console.log(err);
            return res.status(500).send("something went wrong");

        }
    }
}