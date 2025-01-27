
import { ApplicationError } from "../error-handler/applicationError.js";
import userModel from "../user/user.model.js";
export default class productModel {
  constructor( name, description, imgUrl, category, price, sizes,id) {
    this.name = name;
    this.description = description;
    this.imgUrl = imgUrl;
    this.category = category;
    this.price = price;
    this.sizes = sizes;
    this._id = id;
  }
  static getAll() {
    return products;
  }
  static add(product) {
    product.id = products.length + 1;
    products.push(product);
    return product;
  }
  static get(id){
    const product=products.find(p=>p.id==id);
    return product;
  }
  static filter(minPrice,maxPrice,category){
    const result=products.filter(product=>{
      return((!minPrice ||product.price>=minPrice)&&(!maxPrice || product.price<=maxPrice)&&(!category ||product.category==category));
    });
    return result;
  }
  static rate(userId,productId,rating){
    const user=userModel.getAll().find(u=>u.id==userId);
    if(!user){
      throw new ApplicationError("User not Found",404);
    }
    const product=products.find(p=>p.id==productId);
    if(!product){
      throw new ApplicationError("Product not found",404);
    }
    if(!rating || rating<0 || rating>6){
       throw new ApplicationError("rating should be b/w 0-5",404);
    }
    if(!product.rating){
      product.rating=[];
      product.rating.push({userId:userId,rating:rating});
    }
    else{
      //check that which user is rating the product
      const existingProductRating=product.rating.findIndex(r=>r.userId==userId);
      if(existingProductRating>=0){
        //replace the existing rating
        product.rating[existingProductRating]={userId:userId,rating:rating};
      }
      else{
        product.rating.push({userId:userId,rating:rating});
      }
      
    }
  }
}
let products = [new productModel(1,"shirt","a black shirt","https://myimg.pmg","category-1",19.99,["Xl","X","M"]),
new productModel(2,"HeadPhone","JBL headphone","https://JBL.png","category-2",29.99,[])];
