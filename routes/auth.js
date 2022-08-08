const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRETKEY } = require("../config/valuekeys");

// router.get("/",(req,res)=>{
//     res.send("Home Page")
// })

//signup route - user creation
router.post("/signup",(req,res)=>{
    const {name, email, password, dp} = req.body;
    const Email = email.toLowerCase();
    // console.log(req.body);
    let user=null;
    if(!name||!email||!password)
    {
        res.json({error : "Please provide all the details"})
    }
    User.findOne({email : Email}).then(savedUser =>{
        if(savedUser)
        {
            return res.json({error : "Email already exists!"})
        }
        bcrypt.hash(password,12).then(hashedPassword =>{
            if(dp)
            {user = new User({name,email,password : hashedPassword,dp:dp})}
            else
            {user = new User({name,email,password : hashedPassword})}
        user.save().then(user => {
            // console.log(user);
            res.json({message : "Success!"})
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err);
    })
        }).catch(err=>{
            console.log(err);
        })
})

//signin route - user validation
router.post("/signin",(req,res)=>{
    const {email, password} = req.body;
    const Email = email.toLowerCase();
    if(!email||!password)
    {
        res.json({error : "Enter both email and password"})
    }
    User.findOne({email : Email}).then(savedUser =>{
        if(!savedUser)
        {
            return res.json({error : "Email doesn't exist!"})
        }
        bcrypt.compare(password,savedUser.password).then(doMatch =>{
            if(doMatch)
            {
                const token = jwt.sign({id : savedUser._id},JWT_SECRETKEY)
                const {_id,name,email,followers,following,dp} = savedUser;
                res.json({token:token, message: "success!", user:{_id,name,email,followers,following,dp}});
            }
            else{
                res.json({error : "Sign in failed"})
            }
        }).catch(err=>{
        console.log(err);
    })
        }).catch(err=>{
            console.log(err);
        })
})

module.exports = router;