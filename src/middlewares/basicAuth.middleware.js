import userModel from "../features/user/user.model.js";

const basicAuthorizer=(req,res,next)=>{
    //check if the autorization part is empty or not
    const authHeader=req.headers["authorization"];
    if(!authHeader){
       return  res.status(401).send("No authorization details found");
    }
    console.log(authHeader);
    //extract credentials
    const base64Credentials=authHeader.replace("Basic ","");
    console.log(base64Credentials);
    //decode credentials
    const decodeCreds=Buffer.from(base64Credentials,"base64").toString("utf-8");
    console.log(decodeCreds);
    const creds=decodeCreds.split(":");
    console.log(creds);
    const user=userModel.getAll().find(u=>u.email==creds[0] && u.password==creds[1]);
    if(user){
        next();
    }
    else{
        return res.status(401).send("incorrect credentials")
    }
}
export default basicAuthorizer;