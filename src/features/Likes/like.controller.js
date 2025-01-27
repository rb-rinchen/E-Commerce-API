import likeRepository from "./like.repostitory.js";


export default class likeController{
    constructor(){
        this.LikeRepository=new likeRepository();
    }
    async like(req,res){
      try{
        const userId=req.userId;
        const{type,id}=req.body;// here id can be of category or product
        if(type!="product" && type!="category"){
           return res.status(400).send("Invalid Type");   
        }
        if(type=='product'){
          await this.LikeRepository.likeProduct(userId,id);
        }
        else{
            await this.LikeRepository.likeCategory(userId,id);
        }
        return res.status(201).send(`You like a: ${type}`);
      }
      catch{
        console.log(err);
        res.status(500).send("something went wrong in the database")
      }
    }
    async getLikes(req,res){
        try{
            const {id,types}=req.query;
            console.log(req.query);
            const like=await this.LikeRepository.get(id,types);
            res.status(200).send(like);

        }catch(err){
            console.log(err);
            res.status(500).send("something went wrong in the database")
        }
    }
}