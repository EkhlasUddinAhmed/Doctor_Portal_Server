const jwt = require('jsonwebtoken');
const checkAuthorization=(req, res ,next)=>{
   const authHeader=req.headers.authorization;
   if(!authHeader){
    return res.status(401).send({message:"UnAuthorized Access"})
   }
   const token=authHeader.split(" ")[1];

  //  console.log("Token Extracted is:",token);

   jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded) {
    if(err){
        return res.status(403).send({message:"Forbidden Access"});
    }
    
    req.decoded=decoded;
    next();
  });
   
}


module.exports=checkAuthorization;