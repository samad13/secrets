require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));

const connectionString = 'mongodb://localhost:27017/secretsDB';


mongoose.connect(connectionString,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify: false
},(err) =>{
    if (err) {
        console.log(err)
    }else {
        console.log('database connection succesful')
    }
});

const userSchema = new mongoose.Schema  ({
    email: String,
    password:String

});


const User = new mongoose.model("User", userSchema);
//get or read
app.get("/",function(req, res){
    res.render("home")
})

app.get("/login",function(req, res){
    res.render("login")
})

app.get("/register",function(req, res){
    res.render("register")
});

// post send response
app.post("/register",function(req, res){
bcrypt.hash(req.body.password, saltRounds,function(err, hash){
    const newUser = new User({
        email:req.body.username,
        password:hash
    });

    newUser.save(function(err){
        if(err) {
            console.log(err)
        }else {
            res.render("secrets")
        }
    });
})


    
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}, function(err, foundUser){
    if(err){
        console.log(err)
    }else{
        if(foundUser){

            bcrypt.compare(password, foundUser.password,function(err, result){
            if (result === true) {
                res.render("secrets")
        }
    })
        }
    }
    })
});























app.listen(4000, function(){
    console.log("starting server at port 4000")
});

