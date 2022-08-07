const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    followers : [{
        type: ObjectId,
        ref : "User"
    }],
    following : [{
        type: ObjectId,
        ref : "User"
    }],
    dp : {
        type:String,
        default:"https://res.cloudinary.com/kiloud/image/upload/v1658307442/default_dp_vuki5n.jpg"
    }
})

module.exports = mongoose.model("User",userSchema);