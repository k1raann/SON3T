const express = require("express");
const app = express();
const PORT = process.env.PORT||5000;
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/valuekeys");

mongoose.connect(MONGOURI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
})

mongoose.connection.on('connected',()=>{console.log("Successfully Connected to DB");});
mongoose.connection.on('error',()=>{console.log("Connection Failed");});

require("./models/user");
require("./models/post");
app.use(express.json());
app.use(require('./routes/auth'))
app.use(require('./routes/postrouter'))
app.use(require('./routes/userrouter'))


if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'))
    const path = require("path")
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log("Server is Running!");
})