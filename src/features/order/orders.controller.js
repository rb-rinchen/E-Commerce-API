import orderRepository from "./orders.repository.js";

export default class orderController{
    constructor(){
        this.OrderRepository=new orderRepository();
    }
    async placeOrder(req,res){
        try{
          const userId=req.userId;
          await this.OrderRepository.order(userId);
          res.status(201).send("order created ");
        }
        catch(err){
           console.log(err);
           res.status(500).send("something went wrong in the database")
        }
    }
}