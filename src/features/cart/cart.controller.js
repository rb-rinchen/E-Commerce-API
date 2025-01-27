
import cartModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";


export default class cartController{
    constructor(){
        this.cartRepository=new CartRepository();
    }
    async addItem(req,res){
        try{
        const{productId,quantity}=req.body;
        const userId=req.userId;
        await this.cartRepository.add(productId,userId,quantity);
        res.status(201).send("cart is Updated")
        }catch(err){
            console.log(err);
            res.status(500).send("something went wrong");
        }
    }
    async getCart(req,res){
        try{
            const userId=req.userId;
            const cartItem=await this.cartRepository.get(userId);
            res.status(200).send(cartItem);
        }catch(err){
            console.log(err);
            res.status(500).send("something went wrong");
        }
    }
    updateCart(req, res) {
        const userId = req.userId;
        const productId = req.query.productId;
        const quantity = req.query.quantity;
    
        const cart = cartModel.upload(userId, productId, quantity);
        if (cart.error) { // Check if there's an error in the response
            return res.status(404).send(cart.error); // Send the error message
        }
        return res.status(200).send(cart);
    }
    async deleteCart(req,res){
        try{
           const cartId=req.params.id;
           const userId=req.userId;
           const isDeleted=await this.cartRepository.delete(cartId,userId);
           if(!isDeleted){
            res.status(404).send("item not found")
           }
           else{
               res.status(200).send(isDeleted);
               
           }
        }
        catch(err){
            console.log(err);
            res.status(500).send("something went wrong");  
        }
    }
}