const express = require("express");
const requireLogin = require("../middleware/requireLogin");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User")

router.get("/user/:userId",requireLogin,(req,res)=>{
    User.findOne({_id:req.params.userId}).select("-password").then(user=>{
        Post.find({postedBy : req.params.userId}).populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=> {console.log('catch err');return res.status(404).json({error : "User not found!"})})
})

router.put("/follow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,
        {$push : {followers : req.user._id}}, {new : true}).exec((err,followUser) => {
            if(err){ 
                return res.json({error : err})
            }
            User.findByIdAndUpdate(req.user._id,
                {$push : {following : req.body.followId}}, {new : true}).select("-password")
                .then(followingUser=>{res.json({followUser:followUser,followingUser:followingUser})}).catch(err=>console.log(err))
        })
})

router.put("/unfollow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,
        {$pull : {followers : req.user._id}}, {new : true}).exec((err,followUser) => {
            if(err){ 
                return res.json({error : err})
            }
            User.findByIdAndUpdate(req.user._id,
                {$pull : {following : req.body.followId}}, {new : true}).select("-password")
                .then(followingUser=>res.json({followUser,followingUser})).catch(err=>{return res.status(422).json({error:err})})
        })
})

router.put("/changePicture",requireLogin,(req,res)=>{
    // console.log(req.body.pic);
    User.findByIdAndUpdate(req.body.userId,
        {$set :{dp : req.body.pic}},{new : true}).select("-password").exec((err, prof) => {
            if(err){ 
                return res.json({error : err})
            }   
            // console.log(prof);
            return res.json({prof})
        })
})

module.exports = router;