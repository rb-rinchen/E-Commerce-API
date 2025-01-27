import dotenv from "dotenv";
dotenv.config();
import express from  "express";
import swagger from "swagger-ui-express";
import cors from "cors";
import mongoose from "mongoose";


import logMiddleware from "./src/middlewares/logger.middleware.js";
import productRouter from "./src/features/product/product.routes.js";
import bodyParser from "body-parser";
import UserRouter from "./src/features/user/user.routes.js";
import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cart/cart.routes.js";
import apiDocs from "./swagger.json "assert{type :"json"};
import { ApplicationError } from "./src/features/error-handler/applicationError.js";
import { connectMongodb } from "./config/mongodb.js";
import orderrouter from "./src/features/order/orders.routes.js";
import { connectUsingMongoose } from "./config/mongoose.js";
import likeRouter from "./src/features/Likes/like.routes.js";


const server=express();


//cors policy 
server.use(cors());
// server.use((req,res,next)=>{
//     res.header("Access-Control-Allow-Origin","*");
//     res.header("Access-Control-Allow-Headers","Content-Type, *");
//     res.header("Access-Control-Allow-Methods","*");
//     if(req.method=="OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();

// });
server.use(bodyParser.json());
server.use("/api-docs",swagger.serve,swagger.setup(apiDocs));
server.use(logMiddleware);
server.use("/api/products",jwtAuth,productRouter);
server.use("/api/users",UserRouter);
server.use("/api/cartItems",jwtAuth,cartRouter);
server.use("/api/orders",jwtAuth,orderrouter);
server.use("/api/like",jwtAuth,likeRouter);
//handling application level error
server.use((err,req,res,next)=>{
    console.log(err);
    if(err instanceof mongoose.Error.ValidationError){
        return res.status(404).send(err.message);
    }
    if(err instanceof ApplicationError){
        return res.status(err.code).send(err.message);
    }
    res.status(500).send("something went wrong,please try again later");
})

//to handle the 404 error
server.use((req,res)=>{
    res.status(404).send("Path dose not exist.Please check your api documentation for all possible paths localhost:3200/api-docs");
})

server.listen(3200,()=>{
    console.log("server is listening at the port 3200");
    connectUsingMongoose();
})