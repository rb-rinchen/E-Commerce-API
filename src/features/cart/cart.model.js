import productModel from "../product/product.model.js";

export default class cartModel{
    constructor(productId,userId,quantity){
        this.productId=productId;
        this.userId=userId;
        this.quantity=quantity;
    }
}
//     static add(productId,userId,quantity){
//         const cartItem=new cartModel(productId,userId,quantity,cartItems.length+1);
//         cartItems.push(cartItem);
//         return cartItem;

//     }
//     static get(id){
//         return cartItems.filter(cart=>cart.userId==id);
//     }
//     static upload(userId, productId, quantity) {
//         const product = productModel.getAll().find(p => p.id == productId);
//         if (!product) {
//             return { error: "Product not found" }; // Return an error message
//         }
    
//         const cartIndex = cartItems.findIndex(c => c.productId == product.id && c.userId == userId);
//         if (cartIndex === -1) { // Check for -1 instead of null
//             return { error: "Cart item not found" }; // Return an error message
//         } else {
//             let totalQuan = Number(quantity) + Number(cartItems[cartIndex].quantity);
//             let cartItem = new cartModel(product.id, userId, totalQuan, cartItems[cartIndex].id);
//             cartItems[cartIndex] = cartItem;
//             return cartItems;
//         }
//     }
// }
// let cartItems=[new cartModel(1,1,4,1)];