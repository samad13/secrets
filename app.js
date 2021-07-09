require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")


const app = express();

console.log(process.env.API_KEY);

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


userSchema.plugin(encrypt, {secret: process.env.SECRET,encryptedFields:["password"] });

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
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save(function(err){
        if(err) {
            console.log(err)
        }else {
            res.render("secrets")
        }
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}, function(err, foundUser){
    if(err){
        console.log(err)
    }else{
        if(foundUser){
            if (foundUser.password === password) {
                res.render("secrets")
        }
        }
    }
    })
});























app.listen(4000, function(){
    console.log("starting server at port 4000")
});

