import jwt from "jsonwebtoken";

const jwtAuth=(req,res,next)=>{
    //read the token
    const token=req.headers["authorization"];
  
    if(!token){
        return res.status(401).send("Unauthorized");
    }
    try{

      const payload=jwt.verify(token,process.env.JWT_SECRET);
      req.userId=payload.userId;
      console.log(payload);
    }
    catch(err){
        return res.status(401).send("Unauthorized");
    }
    next();
}
export default jwtAuth;