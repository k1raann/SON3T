const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { JWT_SECRETKEY } = require("../config/valuekeys");
const User = mongoose.model("User");

module.exports = (req,res,next) => {
    const {authorization} = req.headers;
    if(!(authorization))
    {   
        return res.json({error : "You must be logged in!",msg:"nauth"});
    }
    const token = authorization.replace("Bearer","");
    jwt.verify(token, JWT_SECRETKEY, (err,payload)=>{
        if(err)
        {
            return res.json({error : "You must be logged in!"});
        }
        const _id = payload.id;
        User.findById(_id).select("-password").then(userdata => {
            req.user = userdata;
            next()
        }).catch(err => {console.log(err);})
    })
}